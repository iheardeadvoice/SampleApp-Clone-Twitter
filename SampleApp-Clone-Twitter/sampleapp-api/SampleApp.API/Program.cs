using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using SampleApp.API.Data;
using SampleApp.API.Extensions;
using SampleApp.API.Interfaces;
using SampleApp.API.Middlewares;
using SampleApp.API.Repositories;
using SampleApp.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Controllers + fix for cyclic JSON serialization
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddDbContext<SampleAppContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PostgreSQL")));

builder.Services.AddScoped<IUserRepository, UsersRepository>();
builder.Services.AddScoped<IMicropostRepository, MicropostRepository>();
builder.Services.AddScoped<IRoleRepository, RolesRepository>();

builder.Services.AddScoped<ITokenService, TokenService>();

builder.Services.AddJwtServices(builder.Configuration);

var app = builder.Build();

app.UseMiddleware<ExceptionHandlerMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<SampleAppContext>();
    dbContext.Database.EnsureCreated();

    if (!dbContext.Roles.Any())
    {
        dbContext.Roles.AddRange(
            new SampleApp.API.Entities.Role
            {
                Id = 1,
                Name = "Admin",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new SampleApp.API.Entities.Role
            {
                Id = 2,
                Name = "Manager",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new SampleApp.API.Entities.Role
            {
                Id = 3,
                Name = "User",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        );

        dbContext.SaveChanges();
        Console.WriteLine("✅ Роли добавлены в базу данных");
    }
}

app.Run();