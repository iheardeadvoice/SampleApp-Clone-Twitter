namespace SampleApp.API.Dtos;

public record UserDto(int Id, string Login, string Name, string Token, DateTime CreatedAt, DateTime UpdatedAt);
