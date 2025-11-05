using Microsoft.VisualStudio.TestTools.UnitTesting;
using Server.Services.Auth;
using Server.Dtos.Auth;
using ServerTest.ServerTest.Fixtures;
using System.Threading.Tasks;

namespace ServerTest.UnitTests.Auth
{
    [TestClass]
    public class AuthenticationServiceTests
    {
        private readonly DbFixture _fixture;
        private readonly IAuthenticationService _authService;

        public AuthenticationServiceTests()
        {
            _fixture = new DbFixture();
            _authService = _fixture.GetAuthService();
        }

        [TestMethod]
        public async Task Login_ShouldFail_WhenPasswordInvalid()
        {
            // Arrange
            var registerRequest = new RegisterRequest
            {
                FullName = "Test User",
                UserName = "testuser",
                Email = "testuser@example.com",
                Password = "ValidPassword123",
                RoleId = 1 // default role id
            };

            // Register the user first
            var registerResult = await _authService.Register(registerRequest);

            // Act
            var loginRequest = new LoginRequest
            {
                UserName = "testuser",
                Password = "WrongPassword"
            };

            // Assert
            await Assert.ThrowsExceptionAsync<System.ArgumentException>(async () =>
            {
                await _authService.Login(loginRequest);
            });
        }

        [TestMethod]
        public async Task Register_ShouldCreateUserAndReturnJwt()
        {
            // Arrange
            var registerRequest = new RegisterRequest
            {
                FullName = "New User",
                UserName = "newuser",
                Email = "newuser@example.com",
                Password = "StrongPass123",
                RoleId = 1
            };

            // Act
            var (accessToken, refreshToken) = await _authService.Register(registerRequest);

            // Assert
            Assert.IsFalse(string.IsNullOrWhiteSpace(accessToken));
            Assert.IsFalse(string.IsNullOrWhiteSpace(refreshToken));
        }
    }
}
