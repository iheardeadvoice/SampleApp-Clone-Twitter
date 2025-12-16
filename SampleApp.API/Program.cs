using Microsoft.EntityFrameworkCore;
using SampleApp.API.Data;
using SampleApp.API.Extensions;
using SampleApp.API.Interfaces;
using SampleApp.API.Middlewares;
using SampleApp.API.Repositories;
using SampleApp.API.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllerServices();

// CORS
builder.Services.AddCors();

// DbContext Postgres
builder.Services.AddDbContext<SampleAppContext>(o =>
    o.UseNpgsql(builder.Configuration.GetConnectionString("PostgreSQL")));

// Repo
builder.Services.AddScoped<IUserRepository, UsersRepository>();

// ✅ Роли (пока MEMORY вариант — чтобы работало сразу)
builder.Services.AddSingleton<IRoleRepository, RoleMemoryRepository>();

// Microposts
builder.Services.AddScoped<IMicropostRepository, MicropostRepository>();

// Token service
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IRoleRepository, RolesRepository>();

// JWT + Swagger + Authorization
builder.Services.AddJwtServices(builder.Configuration);

var app = builder.Build();

// Middleware ошибок
app.UseMiddleware<ExceptionHandlerMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(o => o.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();