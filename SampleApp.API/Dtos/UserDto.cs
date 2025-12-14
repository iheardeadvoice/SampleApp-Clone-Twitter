namespace SampleApp.API.Dtos;

public record UserDto(int Id, string Login, string Name, DateTime CreatedAt, DateTime UpdatedAt);
