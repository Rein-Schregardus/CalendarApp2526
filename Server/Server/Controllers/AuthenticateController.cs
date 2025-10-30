using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Dtos.Auth;
using Server.Services.Auth;

namespace Server.Controllers
{
    /// <summary>
    /// Handles user authentication and registration.
    /// Provides endpoints for login, registration, token refresh, and user listing.
    /// </summary>
    [ApiController]
    [Route("auth")]
    [Produces("application/json")]
    public class AuthenticateController : ControllerBase
    {
        private readonly IAuthenticationService _authService;

        public AuthenticateController(IAuthenticationService authService)
        {
            _authService = authService;
        }

        /// <summary>
        /// Authenticates a user and issues JWT tokens.
        /// </summary>
        /// <remarks>
        /// Accepts either a username or an email along with the password.
        /// On success, sets HTTP-only cookies "jwt_access" (short-lived) and "jwt_refresh" (long-lived).
        /// </remarks>
        /// <param name="request">Login request containing username/email and password.</param>
        /// <returns>A success message with JWT cookies set in the response.</returns>
        /// <response code="200">User logged in successfully.</response>
        /// <response code="400">Invalid login request (missing fields or invalid credentials).</response>
        /// <response code="500">Internal server error.</response>
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var (accessToken, refreshToken) = await _authService.Login(request);
            AppendJwtCookies(accessToken, refreshToken);
            return Ok(new { message = "Logged in successfully" });
        }

        /// <summary>
        /// Registers a new user account and issues JWT tokens.
        /// </summary>
        /// <remarks>
        /// Accepts full name, username, email, and password.
        /// Assigns the default "User" role.
        /// Sets HTTP-only cookies "jwt_access" and "jwt_refresh" on success.
        /// </remarks>
        /// <param name="request">Registration request containing full name, username, email, and password.</param>
        /// <returns>A success message with JWT cookies set in the response.</returns>
        /// <response code="200">User registered successfully.</response>
        /// <response code="400">Invalid registration request (e.g., user already exists).</response>
        /// <response code="500">Internal server error.</response>
        [Authorize(Roles = "Admin")]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var (accessToken, refreshToken) = await _authService.Register(request);
            AppendJwtCookies(accessToken, refreshToken);
            return Ok(new { message = "Registered successfully" });
        }

        /// <summary>
        /// Refreshes JWT tokens using the refresh token.
        /// </summary>
        /// <remarks>
        /// Requires the "jwt_refresh" HTTP-only cookie.
        /// On success, issues new "jwt_access" and "jwt_refresh" cookies.
        /// If the refresh token is invalid or expired, returns 401 Unauthorized.
        /// </remarks>
        /// <returns>A success message with new JWT cookies.</returns>
        /// <response code="200">Tokens refreshed successfully.</response>
        /// <response code="401">Missing, invalid, or expired refresh token.</response>
        /// <response code="500">Internal server error.</response>
        [AllowAnonymous]
        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh()
        {
            if (!Request.Cookies.TryGetValue("jwt_refresh", out var refreshToken) || string.IsNullOrWhiteSpace(refreshToken))
                return Unauthorized(new { message = "Missing refresh token" });

            try
            {
                var (newAccessToken, newRefreshToken) = await _authService.Refresh(refreshToken);
                AppendJwtCookies(newAccessToken, newRefreshToken);
                return Ok(new { message = "Tokens refreshed successfully" });
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized(new { message = "Invalid or expired refresh token" });
            }
        }

        /// <summary>
        /// Retrieves a list of all registered users.
        /// </summary>
        /// <remarks>
        /// Requires authentication via valid JWT access token.
        /// Returns user ID, email, full name, and role for each user.
        /// </remarks>
        /// <returns>A list of user information.</returns>
        /// <response code="200">Returns all registered users.</response>
        /// <response code="401">Unauthorized (missing or invalid JWT).</response>
        /// <response code="500">Internal server error.</response>
        [Authorize]
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _authService.GetAllUsers();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        /// <summary>
        /// Helper method to append JWT cookies to the response.
        /// </summary>
        private void AppendJwtCookies(string accessToken, string refreshToken)
        {
            Response.Cookies.Append("jwt_access", accessToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddMinutes(15)
            });

            Response.Cookies.Append("jwt_refresh", refreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(7)
            });
        }
    }
}
