using Server.Dtos;
using Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IAuthenticationService _authenticationService;

        public UserController(IAuthenticationService authenticationService)
        {
            _authenticationService = authenticationService;
        }

        /// <summary>
        /// Authenticates a user and returns a JWT token.
        /// </summary>
        /// <param name="request">The login request containing email and password.</param>
        /// <returns>JWT token as a string if successful.</returns>
        /// <response code="200">Returns JWT token.</response>
        /// <response code="400">Invalid request or validation failed.</response>
        /// <response code="500">Internal server error.</response>
        [AllowAnonymous]
        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(string))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(ValidationProblemDetails))]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var token = await _authenticationService.Login(request);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,               // true in production
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddHours(3)
            };


                Response.Cookies.Append("jwt", token, cookieOptions);

                return Ok(new { message = "Logged in successfully" });//message instead of token for security
        }

        /// <summary>
        /// Registers a new user and returns a JWT token.
        /// </summary>
        /// <param name="request">The registration request containing username, email, and password.</param>
        /// <returns>JWT token as a string if registration is successful.</returns>
        /// <response code="200">Returns JWT token.</response>
        /// <response code="400">Invalid request or validation failed.</response>
        /// <response code="500">Internal server error.</response>
        [AllowAnonymous]
        [HttpPost("register")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(string))]
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
