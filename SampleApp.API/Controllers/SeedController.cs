using System.Security.Cryptography;
using System.Text;
using Bogus;
using Microsoft.AspNetCore.Mvc;
using SampleApp.API.Data;
using SampleApp.API.Dtos;
using SampleApp.API.Entities;

namespace SampleApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SeedController : ControllerBase
{
    private readonly SampleAppContext db;
    public SeedController(SampleAppContext db) => this.db = db;

    [HttpGet("generate")]
    public ActionResult SeedUsers()
    {
        using var hmac = new HMACSHA256();

        Faker<LoginDto> faker = new Faker<LoginDto>("en")
            .RuleFor(u => u.Name, f => GenerateName(f).Trim())
            .RuleFor(u => u.Login, f => GenerateLogin(f).Trim())
            .RuleFor(u => u.Password, f => GeneratePassword(f).Trim().Replace(" ", ""));

        string GenerateLogin(Faker f) => f.Random.Word() + f.Random.Number(3, 5);
        string GenerateName(Faker f) => f.Random.Word() + f.Random.Number(3, 5);
        string GeneratePassword(Faker f) => f.Random.Word() + f.Random.Number(3, 5);

        var users = faker.Generate(100)
            .Where(u => u.Login.Length > 4 && u.Login.Length <= 10)
            .DistinctBy(u => u.Login);

        var entities = new List<User>();

        try
        {
            foreach (var u in users)
            {
                entities.Add(new User
                {
                    Name = u.Name,
                    Login = u.Login,
                    PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(u.Password)),
                    PasswordSalt = hmac.Key
                });
            }

            db.Users.AddRange(entities);
            db.SaveChanges();
            return Ok(entities);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.InnerException?.Message ?? ex.Message);
        }
    }
}
