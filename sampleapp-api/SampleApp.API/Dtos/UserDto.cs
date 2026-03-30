using SampleApp.API.Entities;
using SampleApp.API.Enums;
namespace SampleApp.API.Dtos;

public record UserDto(int Id, string Login, string Name, string Token, RoleType Role,DateTime CreatedAt, DateTime UpdatedAt);