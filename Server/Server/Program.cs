using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Server.Db;
using Server.Entities;
using System.Text;
using NSwag;
using NSwag.Generation.Processors.Security;
using DotNetEnv;
using Server.Services.Auth;
using Server.Services.Events;
using Server.Services.Roles;
using Server.Middleware;
using Server.Services.EventAttendances;
using Server.Services.RoomReservations;

namespace Server
{
    public partial class Program
    {
        public static void Main(string[] args)
        {
            Env.Load();

            var builder = WebApplication.CreateBuilder(args);
            var configuration = builder.Configuration;

            // get environment variables
            var dbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD");
            var jwtSecretKey = Environment.GetEnvironmentVariable("JWT_SECRET")
                   ?? "SuperSecretTestKey123!"; // default for local dev/testing
            builder.Services.AddSingleton(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecretKey)));

            // validate JWT secret key
            if (string.IsNullOrWhiteSpace(jwtSecretKey) || Encoding.UTF8.GetBytes(jwtSecretKey).Length < 16)
            {
                throw new Exception("JWT_SECRET must be at least 16 characters long and set in .env file.");
            }

            // Database
            var dbConnection = configuration.GetConnectionString("db")?.Replace("${DB_PASSWORD}", dbPassword);
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(dbConnection));

            // JWT Auth
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        if (context.Request.Cookies.ContainsKey("jwt_access"))
                        {
                            context.Token = context.Request.Cookies["jwt_access"];
                        }
                        return Task.CompletedTask;
                    }
                };

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidAudience = configuration["JWT:ValidAudience"],
                    ValidIssuer = configuration["JWT:ValidIssuer"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecretKey))
                };
            });

            builder.Services.AddControllers();

            // Interfaces
            builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();
            builder.Services.AddScoped<IEventService, EventService>();
            builder.Services.AddScoped<IRoleService, RoleService>();
            builder.Services.AddScoped<IEventAttendanceService, EventAttendanceService>();
            builder.Services.AddScoped<IScheduleItemSerivce, ScheduleItemService>();
            builder.Services.AddScoped<IReservationService, ReservationService>();
            builder.Services.AddScoped<IOfficeAttendanceService, OfficeAttendanceService>();

            // CORS
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                {
                    policy
                         .WithOrigins(
                            "http://localhost:5173",
                            "https://localhost:5173",
                            "https://localhost:7223",
                            "http://localhost:5005"
                        )
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                });
            });

            // Swagger
            builder.Services.AddOpenApiDocument(config =>
            {
                config.Title = "CalendarApp 2526";
                config.Version = "v1";
                config.Description = "API for managing users, calendar items and more";

                config.AddSecurity("JWT", Enumerable.Empty<string>(), new OpenApiSecurityScheme
                {
                    Type = OpenApiSecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT",
                    In = OpenApiSecurityApiKeyLocation.Header,
                    Name = "Authorization",
                    Description = "Enter 'Bearer' followed by your valid JWT token"
                });
                config.OperationProcessors.Add(new AspNetCoreOperationSecurityScopeProcessor("JWT"));
            });

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseOpenApi();
                app.UseSwaggerUi();
            }

            app.UseCors("AllowFrontend");
            if (!app.Environment.IsDevelopment())
                app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseMiddleware<JwtRefreshMiddleware>();
            app.UseAuthorization();
            app.MapControllers();
            app.UseStaticFiles(); // exposes wwwroot as endpoint

            app.Run();
        }
    }
    public partial class Program { } // exposes Program to WebApplicationFactory
}
