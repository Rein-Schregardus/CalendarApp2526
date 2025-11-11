using Microsoft.VisualStudio.TestTools.UnitTesting;
using Server.Dtos.Auth;
using ServerTest.ServerTest.Fixtures;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace Server.Tests.IntegrationTests.Auth
{
    [TestClass]
    public class AuthenticateControllerTests
    {
        private readonly ApiFixture _fixture;
        private readonly HttpClient _client;

        public AuthenticateControllerTests()
        {
            _fixture = new ApiFixture();
            _client = _fixture.Client;
        }

        private async Task<string> LoginAsAdminAsync()
        {
            var loginRequest = new LoginRequest
            {
                UserName = "admin",
                Password = "admin123"
            };

            var loginResponse = await _client.PostAsJsonAsync("/auth/login", loginRequest);
            loginResponse.EnsureSuccessStatusCode();

            // Extract JWT from cookie
            var accessCookie = loginResponse.Headers.GetValues("Set-Cookie")
                .FirstOrDefault(c => c.StartsWith("jwt_access"));

            Assert.IsNotNull(accessCookie, "Access token cookie not set.");

            // Extract token value
            var token = accessCookie.Split(';').First().Split('=').Last();
            return token;
        }

        [TestMethod]
        public async Task Register_ShouldReturnSuccessMessage_AdminOnly()
        {
            // Arrange: Login as admin to get JWT
            var token = await LoginAsAdminAsync();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var registerRequest = new RegisterRequest
            {
                FullName = "Test User",
                UserName = "testuser1",
                Email = "testuser1@example.com",
                Password = "password123",
                RoleId = 2
            };

            // Act
            var response = await _client.PostAsJsonAsync("/auth/register", registerRequest);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            Assert.IsTrue(content.Contains("Registered successfully"));
        }

        [TestMethod]
        public async Task Refresh_ShouldReturnNewAccessToken_WhenRefreshTokenValid()
        {
            // Step 1: Login to get JWT cookies
            var loginRequest = new LoginRequest
            {
                UserName = "admin",
                Password = "admin123"
            };

            var loginResponse = await _client.PostAsJsonAsync("/auth/login", loginRequest);
            loginResponse.EnsureSuccessStatusCode();

            // Step 2: Extract refresh cookie
            var refreshCookie = loginResponse.Headers.GetValues("Set-Cookie")
                .FirstOrDefault(c => c.StartsWith("jwt_refresh"));

            Assert.IsNotNull(refreshCookie);

            // Step 3: Attach cookie to next request
            var requestMessage = new HttpRequestMessage(HttpMethod.Post, "/auth/refresh");
            requestMessage.Headers.Add("Cookie", refreshCookie);

            // Act
            var refreshResponse = await _client.SendAsync(requestMessage);

            // Assert
            refreshResponse.EnsureSuccessStatusCode();
            var content = await refreshResponse.Content.ReadAsStringAsync();
            Assert.IsTrue(content.Contains("Tokens refreshed successfully"));
        }
    }
}
