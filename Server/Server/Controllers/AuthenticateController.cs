using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Dtos.Auth;
using Server.Services;

namespace Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Produces("application/json")]
    public class AuthenticateController : ControllerBase
    {
        private readonly IAuthenticationService _authenticationService;

        public AuthenticateController(IAuthenticationService authenticationService)
        {
            _authenticationService = authenticationService;
        }

        /// <summary>
        /// Authenticates a user and sets a JWT cookie.
        /// </summary>
        /// <param name="request">Login request containing email and password.</param>
        /// <remarks>
        /// On successful login, a secure HttpOnly cookie named "jwt" is set.
        /// Returns a success message for security instead of the token directly.
        /// </remarks>
        /// <response code="200">Login successful, cookie set.</response>
        /// <response code="400">Invalid request or validation failed.</response>
        /// <response code="500">Internal server error.</response>
        [AllowAnonymous]
        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(object))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(ValidationProblemDetails))]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var token = await _authenticationService.Login(request);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddHours(3)
            };

            Response.Cookies.Append("jwt", token, cookieOptions);

            return Ok(new { message = "Logged in successfully" });
        }

        /// <summary>
        /// Registers a new user and sets a JWT cookie.
        /// </summary>
        /// <param name="request">Registration request containing username, email, password, and optional role.</param>
        /// <remarks>
        /// On successful registration, a secure HttpOnly cookie named "jwt" is set.
        /// Returns a success message for security instead of the token directly.
        /// </remarks>
        /// <response code="200">Registration successful, cookie set.</response>
        /// <response code="400">Invalid request or validation failed.</response>
        /// <response code="500">Internal server error.</response>
        [AllowAnonymous]
        [HttpPost("register")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(object))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(ValidationProblemDetails))]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var token = await _authenticationService.Register(request);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddHours(3)
            };

            Response.Cookies.Append("jwt", token, cookieOptions);

            return Ok(new { message = "Registered successfully" });
        }
    }
}
