using Microsoft.EntityFrameworkCore;
using SampleApp.API.Data;
using SampleApp.API.Entities;
using SampleApp.API.Exceptions;
using SampleApp.API.Interfaces;

namespace SampleApp.API.Repositories;

public class UsersRepository : IUserRepository
{
    private readonly SampleAppContext _db;
    private readonly ILogger<UsersRepository> _logger;

    public UsersRepository(SampleAppContext db, ILogger<UsersRepository> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task<User> CreateUserAsync(User user)
    {
        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        _logger.LogInformation("Пользователь создан: Login={Login}, Id={Id}", user.Login, user.Id);
        return user;
    }

    public async Task<List<User>> GetUsersAsync()
    {
        var users = await _db.Users.AsNoTracking().ToListAsync();
        _logger.LogInformation("Запрошен список пользователей. Count={Count}", users.Count);
        return users;
    }

    public async Task<User> EditUserAsync(User user, int id)
    {
        var existing = await _db.Users.FindAsync(id);
        if (existing is null)
        {
            _logger.LogWarning("Обновление: пользователь не найден. Id={Id}", id);
            throw new NotFoundException($"Нет пользователя с id={id}");
        }

        existing.Login = user.Login;
        existing.Name = user.Name;
        existing.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        _logger.LogInformation("Пользователь обновлён. Id={Id}", id);
        return existing;
    }

    public async Task<bool> DeleteUserAsync(int id)
    {
        var user = await _db.Users.FindAsync(id);
        if (user is null)
        {
            _logger.LogWarning("Удаление: пользователь не найден. Id={Id}", id);
            throw new NotFoundException($"Нет пользователя с id={id}");
        }

        _db.Users.Remove(user);
        await _db.SaveChangesAsync();

        _logger.LogInformation("Пользователь удалён. Id={Id}", id);
        return true;
    }

    public async Task<User> FindUserByIdAsync(int id)
    {
        var user = await _db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == id);
        if (user is null)
        {
            _logger.LogWarning("Поиск по Id: пользователь не найден. Id={Id}", id);
            throw new NotFoundException("Пользователь не найден");
        }

        _logger.LogInformation("Поиск по Id: найден пользователь. Id={Id}", id);
        return user;
    }

    public async Task<User> FindUserByLoginAsync(string login)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Login == login);
        if (user is null)
        {
            _logger.LogWarning("Поиск по Login: пользователь не найден. Login={Login}", login);
            throw new NotFoundException("Пользователь не найден");
        }

        _logger.LogInformation("Поиск по Login: найден пользователь. Login={Login}, Id={Id}", login, user.Id);
        return user;
    }
}
