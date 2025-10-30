using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Server.Services.Auth;

namespace Server.Middleware
{
    /// <summary>
    /// Automatically refreshes JWT access tokens if they are expired,
    /// using the refresh token cookie. Works for any HTTP request.
    /// </summary>
    public class JwtRefreshMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<JwtRefreshMiddleware> _logger;

        public JwtRefreshMiddleware(RequestDelegate next, ILogger<JwtRefreshMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context, IAuthenticationService authService)
        {
            // Only run when both cookies exist
            if (!context.Request.Cookies.TryGetValue("jwt_access", out var accessToken) ||
                !context.Request.Cookies.TryGetValue("jwt_refresh", out var refreshToken))
            {
                await _next(context);
                return;
            }

            var handler = new JwtSecurityTokenHandler();
            JwtSecurityToken? jwt = null;

            try
            {
                jwt = handler.ReadJwtToken(accessToken);
                // If still valid, just continue
                if (jwt.ValidTo > DateTime.UtcNow)
                {
                    await _next(context);
                    return;
                }
            }
            catch
            {
                _logger.LogDebug("Access token invalid format, trying refresh...");
            }

            try
            {
                // Attempt refresh via auth service
                var (newAccess, newRefresh) = await authService.Refresh(refreshToken);

                // Write refreshed cookies
                var cookieSecure = !context.Request.IsHttps ? false : true;

                context.Response.Cookies.Append("jwt_access", newAccess, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = cookieSecure,
                    SameSite = SameSiteMode.None,
                    Expires = DateTime.UtcNow.AddMinutes(15)
                });

                context.Response.Cookies.Append("jwt_refresh", newRefresh, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = cookieSecure,
                    SameSite = SameSiteMode.None,
                    Expires = DateTime.UtcNow.AddDays(7)
                });

                // Re-authenticate the user for *this* request too
                var refreshedJwt = handler.ReadJwtToken(newAccess);
                var claims = new System.Security.Claims.ClaimsIdentity(
                    refreshedJwt.Claims, "jwt_refresh");
                context.User = new System.Security.Claims.ClaimsPrincipal(claims);

                _logger.LogInformation("Access token auto-refreshed for user {sub}", refreshedJwt.Subject);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Token auto-refresh failed.");
                // Continue; controller will return 401 if necessary
            }

            await _next(context);
        }
    }

    /// <summary>
    /// Extension method for Program.cs
    /// </summary>
    public static class JwtRefreshMiddlewareExtensions
    {
        public static IApplicationBuilder UseJwtAutoRefresh(this IApplicationBuilder app)
        {
            return app.UseMiddleware<JwtRefreshMiddleware>();
        }
    }
}
