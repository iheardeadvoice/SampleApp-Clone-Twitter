using SampleApp.API.Enums;

namespace SampleApp.API.Dtos;

public class LoginDto
{
    public string Name { get; set; } = string.Empty;
    public string Login { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;

    public string? Role { get; set; }
    
}