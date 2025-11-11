using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Server;
using Server.Db;
using Server.Entities;
using Server.Services.Auth;
using Server.Services.Events;
using Server.Services.Roles;
using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using DotNetEnv;

namespace ServerTest.ServerTest.Fixtures
{
    public class ApiFixture : IAsyncDisposable
    {
        public readonly HttpClient Client;
        public readonly IAuthenticationService AuthService;
        public readonly IRoleService RoleService;
        public readonly IEventService EventService;

        private readonly WebApplicationFactory<Program> _factory;
        private readonly IServiceScope _scope;
        private readonly string _testDatabaseName;

        public ApiFixture()
        {
            // Load .env from WebAPI folder
            var envPath = Path.Combine(
                Directory.GetParent(AppContext.BaseDirectory).Parent.Parent.Parent.FullName, 
                @"..\..\Server\Server\.env");
            envPath = Path.GetFullPath(envPath);

            if (!File.Exists(envPath))
                throw new FileNotFoundException($".env file not found at {envPath}");

            Env.Load(envPath);

            var dbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD");
            if (string.IsNullOrWhiteSpace(dbPassword))
                throw new InvalidOperationException("DB_PASSWORD must be set in .env.");

            // Unique test DB name
            _testDatabaseName = $"CalendarApp2526Test_{Guid.NewGuid():N}";

            _factory = new WebApplicationFactory<Program>()
                .WithWebHostBuilder(builder =>
                {
                    builder.ConfigureServices(services =>
                    {
                        // Remove the real DbContext registration
                        var descriptor = services.SingleOrDefault(
                            d => d.ServiceType == typeof(DbContextOptions<AppDbContext>));
                        if (descriptor != null)
                            services.Remove(descriptor);

                        // Add DbContext pointing to temporary test database
                        services.AddDbContext<AppDbContext>(options =>
                        {
                            options.UseNpgsql(
                                $"Host=localhost;Database={_testDatabaseName};Username=postgres;Password={dbPassword}");
                        });
                    });
                });

            Client = _factory.CreateClient();
            _scope = _factory.Services.CreateScope();
            var sp = _scope.ServiceProvider;

            AuthService = sp.GetRequiredService<IAuthenticationService>();
            RoleService = sp.GetRequiredService<IRoleService>();
            EventService = sp.GetRequiredService<IEventService>();

            // Apply migrations and seed admin user
            var db = sp.GetRequiredService<AppDbContext>();
            db.Database.Migrate();  
            SeedAdminUserAsync(db).GetAwaiter().GetResult();
        }

        private async Task SeedAdminUserAsync(AppDbContext db)
        {
            if (!await db.Users.AnyAsync())
            {
                var adminRole = await db.Roles.FirstOrDefaultAsync(r => r.RoleName == "Admin");
                if (adminRole == null)
                {
                    adminRole = new Role { RoleName = "Admin" };
                    db.Roles.Add(adminRole);
                    await db.SaveChangesAsync();
                }

                var adminUser = new User
                {
                    FullName = "Admin User",
                    UserName = "admin",
                    Email = "admin@example.com",
                    Role = adminRole,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                    CreatedAt = DateTime.UtcNow
                };

                db.Users.Add(adminUser);
                await db.SaveChangesAsync();
            }
        }

        public async ValueTask DisposeAsync()
        {
            try
            {
                var db = _scope.ServiceProvider.GetRequiredService<AppDbContext>();
                await db.Database.EnsureDeletedAsync(); // remove temporary test database
            }
            catch { /* ignore cleanup errors */ }

            Client.Dispose();
            _scope.Dispose();
            _factory.Dispose();
        }
    }
}
