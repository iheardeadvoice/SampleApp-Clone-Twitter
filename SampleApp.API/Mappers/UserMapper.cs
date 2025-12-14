using SampleApp.API.Dtos;
using SampleApp.API.Entities;

namespace SampleApp.API.Mappers;

public static class UserMapper
{
    public static UserDto ToDto(this User user) =>
        new(user.Id, user.Login, user.Name, user.Token, user.CreatedAt, user.UpdatedAt);
}
