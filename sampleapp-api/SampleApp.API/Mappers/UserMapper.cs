using SampleApp.API.Dtos;
using SampleApp.API.Entities;
using SampleApp.API.Enums;
namespace SampleApp.API.Mappers;
public static class UserMapper
{
    public static UserDto ToDto(this User user)
    {
        return new UserDto(
        
            user.Id,
            user.Login,
            user.Name,
            user.Token ?? string.Empty,
            (RoleType)user.RoleId,
            user.CreatedAt,
            user.UpdatedAt
        );
    }

    public static User ToEntity(this UserDto userDto)
    {
        return new User()
        {
            Id = userDto.Id,
            Login = userDto.Login,
            Name = userDto.Name,
            Token = userDto.Token,
            RoleId = (int)userDto.Role,
            CreatedAt = userDto.CreatedAt,
            UpdatedAt = userDto.UpdatedAt,
            PasswordHash = null!,
            PasswordSalt = null!,
        };
    }
}