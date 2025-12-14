using Microsoft.EntityFrameworkCore;
using SampleApp.API.Data;
using SampleApp.API.Interfaces;
using SampleApp.API.Repositories;

var builder = WebApplication.CreateBuilder(args);

// ВАЖНО: AddDbContext обязателен, он регистрирует DbContextOptions<SampleAppContext>
builder.Services.AddDbContext<SampleAppContext>(o =>
    o.UseNpgsql(builder.Configuration["ConnectionStrings:PostgreSQL"]));

// Репозиторий уже ПОСЛЕ AddDbContext (порядок не критичен, но так проще не ошибиться)
builder.Services.AddScoped<IUserRepository, UsersRepository>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var app = builder.Build();


app.UseSwagger();
app.UseSwaggerUI();

app.MapControllers();
app.Run();


