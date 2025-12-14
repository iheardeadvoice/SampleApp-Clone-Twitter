using Microsoft.EntityFrameworkCore;
using SampleApp.API.Data;
using SampleApp.API.Extensions;
using SampleApp.API.Interfaces;
using SampleApp.API.Middlewares;
using SampleApp.API.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Controllers + Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c => c.EnableAnnotations());

// DbContext (Postgres)
builder.Services.AddDbContext<SampleAppContext>(o =>
    o.UseNpgsql(builder.Configuration.GetConnectionString("PostgreSQL")));

// Репозиторий (БД)
builder.Services.AddScoped<IUserRepository, UsersRepository>();

// FluentValidation auto
builder.Services.AddFluentValidationServices();

var app = builder.Build();

// Глобальный обработчик ошибок (должен быть как можно раньше)
app.UseMiddleware<ExceptionHandlerMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();

app.Run();
