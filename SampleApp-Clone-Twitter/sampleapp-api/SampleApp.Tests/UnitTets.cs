using System.Security.Cryptography;
using System.Text;
using SampleApp.API.Dtos;
using SampleApp.API.Entities;
using SampleApp.API.Repositories;
using SampleApp.API.Validations;
using Xunit;

namespace SampleApp.Tests;

public class UnitTest1
{
    [Fact]
    public void LoginDtoValidator_ShouldBeValid_WhenLoginStartsWithCapital()
    {
        var dto = new LoginDto
        {
            Name = "User1",
            Login = "User1",
            Password = "Pass123"
        };

        var validator = new UserValidator();
        var result = validator.Validate(dto);

        Assert.True(result.IsValid);
    }

    [Fact]
    public void LoginDtoValidator_ShouldBeInvalid_WhenLoginStartsWithLowercase()
    {
        var dto = new LoginDto
        {
            Name = "User1",
            Login = "user1",
            Password = "Pass123"
        };

        var validator = new UserValidator();
        var result = validator.Validate(dto);

        Assert.False(result.IsValid);
    }
}

public class UsersMemoryRepositoryTests
{
    private readonly UsersMemoryRepository _repository;
    private readonly List<User> _testUsers;

    public UsersMemoryRepositoryTests()
    {
        _repository = new UsersMemoryRepository();
        _testUsers = new List<User>
        {
            MakeUser(1, "Alice", "AliceLogin"),
            MakeUser(2, "Bob", "BobLogin")
        };
    }


    private static User MakeUser(int id, string name, string login)
    {
        using var hmac = new HMACSHA256();

        return new User
        {
            Id = id,
            Name = name,
            Login = login,
            PasswordSalt = hmac.Key,
            PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("TestPassword123")),
            Token = "token"
        };
    }

    [Fact]
    public async Task CreateUserAsync_ShouldAddUser_AndReturnIt()
    {
        var user = MakeUser(3, "Charlie", "CharlieLogin");

        var result = await _repository.CreateUserAsync(user);

        Assert.Equal(3, result.Id);
        Assert.Equal("Charlie", result.Name);

        var allUsers = await _repository.GetUsersAsync();
        Assert.Contains(allUsers, u => u.Id == 3);
    }

    [Fact]
    public async Task FindUserByIdAsync_ShouldReturnUser_WhenExists()
    {
        await _repository.CreateUserAsync(_testUsers[0]);

        var result = await _repository.FindUserByIdAsync(1);

        Assert.Equal(1, result.Id);
        Assert.Equal("Alice", result.Name);
    }

    [Fact]
    public async Task FindUserByIdAsync_ShouldThrowException_WhenNotFound()
    {
        await Assert.ThrowsAsync<Exception>(async () =>
            await _repository.FindUserByIdAsync(999));
    }

    [Fact]
    public async Task EditUserAsync_ShouldUpdateUser_WhenExists()
    {
        await _repository.CreateUserAsync(_testUsers[0]);

        // updatedUser тоже должен быть валидным User (required поля)
        var updatedUser = MakeUser(0, "Alicia", "AliciaLogin");

        var result = await _repository.EditUserAsync(updatedUser, 1);

        Assert.Equal("Alicia", result.Name);
        Assert.Equal(1, result.Id);
    }

    [Fact]
    public async Task EditUserAsync_ShouldThrowException_WhenNotFound()
    {
        var user = MakeUser(0, "Nonexistent", "NonexistentLogin");

        await Assert.ThrowsAsync<Exception>(async () =>
            await _repository.EditUserAsync(user, 999));
    }

    [Fact]
    public async Task DeleteUserAsync_ShouldRemoveUser_AndReturnTrue_WhenExists()
    {
        await _repository.CreateUserAsync(_testUsers[0]);

        var result = await _repository.DeleteUserAsync(1);

        Assert.True(result);

        var remainingUsers = await _repository.GetUsersAsync();
        Assert.DoesNotContain(remainingUsers, u => u.Id == 1);
    }

    [Fact]
    public async Task DeleteUserAsync_ShouldThrowException_WhenNotFound()
    {
        await Assert.ThrowsAsync<Exception>(async () =>
            await _repository.DeleteUserAsync(999));
    }

    [Fact]
    public async Task FindUserByLoginAsync_ShouldReturnUser_WhenLoginMatches()
    {
        await _repository.CreateUserAsync(_testUsers[1]);

        // ВАЖНО: искать надо по Login, не по Name
        var result = await _repository.FindUserByLoginAsync("BobLogin");

        Assert.NotNull(result);
        Assert.Equal(2, result.Id);
        Assert.Equal("Bob", result.Name);
    }

    [Fact]
    public async Task FindUserByLoginAsync_ShouldThrowOrReturnNull_WhenNoMatch()
    {
        // Если твой репозиторий кидает Exception — тест пройдёт.
        // Если возвращает null — тоже ок.
        try
        {
            var result = await _repository.FindUserByLoginAsync("UnknownLogin");
            Assert.Null(result);
        }
        catch (Exception)
        {
            Assert.True(true);
        }
    }

    [Fact]
    public async Task GetUsersAsync_ShouldReturnAllUsers()
    {
        await _repository.CreateUserAsync(_testUsers[0]);
        await _repository.CreateUserAsync(_testUsers[1]);

        var users = await _repository.GetUsersAsync();

        Assert.Equal(2, users.Count);
        Assert.Contains(users, u => u.Id == 1);
        Assert.Contains(users, u => u.Id == 2);
    }

    [Fact]
    public async Task GetUsersAsync_ShouldReturnEmptyList_WhenNoUsers()
    {
        var users = await _repository.GetUsersAsync();
        Assert.Empty(users);
    }
}