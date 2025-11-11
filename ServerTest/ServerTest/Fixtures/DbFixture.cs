using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Server.Db;
using Server.Services.Auth;
using Server.Entities;
using System.Text;

namespace ServerTest.ServerTest.Fixtures
{
    public class DbFixture
    {
        public AppDbContext Context { get; }
        private readonly IAuthenticationService _authService;

        public DbFixture()
        {
            // In-memory database
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;


            Context = new AppDbContext(options);

            // Add default role
            Context.Roles.Add(new Role { Id = 1, RoleName = "User" });
            Context.SaveChanges();

            // Symmetric key for JWT
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("SuperSecretTestKey123456789012345")); // 32+ chars

            // Dummy configuration
            var config = new ConfigurationBuilder()
                .AddInMemoryCollection(new Dictionary<string, string?>
                {
                    {"JWT:ValidIssuer", "TestIssuer"},
                    {"JWT:ValidAudience", "TestAudience"}
                })
                .Build();

            _authService = new AuthenticationService(Context, config, key);
        }

        public IAuthenticationService GetAuthService() => _authService;
    }
}
