using Microsoft.EntityFrameworkCore;
using SampleApp.API.Data;
using SampleApp.API.Extensions;
using SampleApp.API.Interfaces;
using SampleApp.API.Middlewares;
using SampleApp.API.Repositories;
using SampleApp.API.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// CORS
builder.Services.AddCors();

// DbContext Postgres
builder.Services.AddDbContext<SampleAppContext>(o =>
    o.UseNpgsql(builder.Configuration.GetConnectionString("PostgreSQL")));

// Repo
builder.Services.AddScoped<IUserRepository, UsersRepository>();

// Token service
builder.Services.AddScoped<ITokenService, TokenService>();

// JWT + Swagger + Authorization
builder.Services.AddJwtServices(builder.Configuration);

var app = builder.Build();

// Middleware ошибок (если ты делал Sprint с обработчиком)
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
