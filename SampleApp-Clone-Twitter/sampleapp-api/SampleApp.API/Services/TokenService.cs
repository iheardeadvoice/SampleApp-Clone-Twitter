using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SampleApp.API.Services;

public class TokenService : ITokenService
{
    private readonly SymmetricSecurityKey _key;

    public TokenService(IConfiguration config)
    {
        var keyString = config["TokenPublicKey"]!;
        
        if (string.IsNullOrEmpty(keyString))
            throw new InvalidOperationException("TokenPublicKey is missing in appsettings.json");
        
        if (keyString.Length < 32)
            throw new InvalidOperationException("TokenPublicKey must be at least 32 characters long");
        
        _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));
    }

    public string CreateToken(string userLogin)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, userLogin),
            new Claim(ClaimTypes.NameIdentifier, userLogin)
        };

        var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: null,
            audience: null,
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}