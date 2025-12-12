using Microsoft.OpenApi;
using SampleApp.API.Interfaces;
using SampleApp.API.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddSwaggerGen(c =>
{
    c.EnableAnnotations();
    c.SwaggerDoc(
        "v1",
        new OpenApiInfo
        {
            Title = "SampleApp",
            Version = "v1",
            Description = "API для пользователей",
            Contact = new OpenApiContact
            {
                Url = new Uri("http://prep.scc/~asv"),
                Email = "asv@prep.scc",
            },
        }
    );
});


// ������������ ���������� ����������
builder.Services.AddSingleton<IUserRepository, UsersMemoryRepository>();
builder.Services.AddSingleton<IRoleRepository, RoleMemoryRepository>();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.MapControllers();
app.Run();


