using System.Reflection;
using SampleApp.API.Entities;
using SampleApp.API.Repositories;
using SampleApp.API.Validations;

namespace SampleApp.Tests;

public class UnitTest1
{
    [Fact]
    public void AddUserCheckValidName()
    {

        var user = new User() { Id = 1, Name = "User1" };

        var validator = new UserValidator();
        var result = validator.Validate(user);

        var expected = true; 
        var actual = result.IsValid;

        Assert.Equal(expected, actual);
    }
}
public class UsersMemoryRepositoryTests
{
    private UsersMemoryRepository _repository;
    private List<User> _testUsers;

    public UsersMemoryRepositoryTests()
    {
        _repository = new UsersMemoryRepository();
        _testUsers = new List<User>
        {
            new User { Id = 1, Name = "Alice" },
            new User { Id = 2, Name = "Bob" }
        };
    }

    [Fact]
    public async Task CreateUserAsync_ShouldAddUser_AndReturnIt()
    {
        var user = new User { Id = 3, Name = "Charlie" };

        var result = await _repository.CreateUserAsync(user);

        Assert.Equal(3, result.Id);
        Assert.Equal("Charlie", result.Name);
        
        var allUsers = await _repository.GetUsersAsync();
        Assert.Contains(result, allUsers);
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

        var updatedUser = new User { Name = "Alicia" };
        var result = await _repository.EditUserAsync(updatedUser, 1);

        Assert.Equal("Alicia", result.Name);
        Assert.Equal(1, result.Id);
    }

    [Fact]
    public async Task EditUserAsync_ShouldThrowException_WhenNotFound()
    {
        var user = new User { Name = "Nonexistent" };

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
        Assert.DoesNotContain(_testUsers[0], remainingUsers);
    }

    [Fact]
    public async Task DeleteUserAsync_ShouldThrowException_WhenNotFound()
    {
        await Assert.ThrowsAsync<Exception>(async () =>
            await _repository.DeleteUserAsync(999));
    }

    [Fact]
    public async Task FindUserByLoginAsync_ShouldReturnUser_WhenNameMatches()
    {
        await _repository.CreateUserAsync(_testUsers[1]);

        var result = await _repository.FindUserByLoginAsync("Bob");

        Assert.NotNull(result);
        Assert.Equal(2, result.Id);
        Assert.Equal("Bob", result.Name);
    }

    [Fact]
    public async Task FindUserByLoginAsync_ShouldReturnNull_WhenNoMatch()
    {
        var result = await _repository.FindUserByLoginAsync("Unknown");

        Assert.Null(result);
    }

    [Fact]
    public async Task GetUsersAsync_ShouldReturnAllUsers()
    {
        await _repository.CreateUserAsync(_testUsers[0]);
        await _repository.CreateUserAsync(_testUsers[1]);

        var users = await _repository.GetUsersAsync();

        Assert.Equal(2, users.Count);
        Assert.Contains(_testUsers[0], users);
        Assert.Contains(_testUsers[1], users);
    }

    [Fact]
    public async Task GetUsersAsync_ShouldReturnEmptyList_WhenNoUsers()
    {
        var users = await _repository.GetUsersAsync();

        Assert.Empty(users);
    }
}