namespace SampleApp.API.Entities;

public class User : Base
{
    public string Login { get; set; } = string.Empty;

    public required byte[] PasswordHash { get; set; }
    public required byte[] PasswordSalt { get; set; }

    // Если у тебя в Sprint1 был Name — оставь:
    public string Name { get; set; } = string.Empty;
}
