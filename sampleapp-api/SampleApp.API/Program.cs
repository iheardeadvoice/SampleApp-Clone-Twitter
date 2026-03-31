using Microsoft.EntityFrameworkCore;
using SampleApp.API.Data;
using SampleApp.API.Extensions;
using SampleApp.API.Interfaces;
using SampleApp.API.Middlewares;
using SampleApp.API.Repositories;
using SampleApp.API.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllerServices();

// CORS - настроим для работы с credentials
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

// DbContext Postgres
builder.Services.AddDbContext<SampleAppContext>(o =>
    o.UseNpgsql(builder.Configuration.GetConnectionString("PostgreSQL")));

// Repositories
builder.Services.AddScoped<IUserRepository, UsersRepository>();
builder.Services.AddScoped<IMicropostRepository, MicropostRepository>();
builder.Services.AddScoped<IRoleRepository, RolesRepository>(); // Только один, не дублируем

// Token service
builder.Services.AddScoped<ITokenService, TokenService>();

// JWT + Swagger + Authorization
builder.Services.AddJwtServices(builder.Configuration);

var app = builder.Build();

// Middleware ошибок (первым)
app.UseMiddleware<ExceptionHandlerMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// CORS - ДО UseAuthentication и UseAuthorization
app.UseCors("AllowReactApp");

// Аутентификация и авторизация - ВАЖНЫЙ ПОРЯДОК!
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Убедимся, что база данных создана и роли есть
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<SampleAppContext>();
    dbContext.Database.EnsureCreated();
    
    // Добавляем роли, если их нет
    if (!dbContext.Roles.Any())
    {
        dbContext.Roles.AddRange(
            new SampleApp.API.Entities.Role { Id = 1, Name = "Admin", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
            new SampleApp.API.Entities.Role { Id = 2, Name = "Manager", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
            new SampleApp.API.Entities.Role { Id = 3, Name = "User", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
        );
        dbContext.SaveChanges();
        Console.WriteLine("✅ Роли добавлены в базу данных");
    }
}

app.Run();