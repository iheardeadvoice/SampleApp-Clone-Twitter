using Microsoft.EntityFrameworkCore;
using SampleApp.API.Data;
using SampleApp.API.Entities;
using SampleApp.API.Interfaces;

namespace SampleApp.API.Repositories;

public class UsersRepository : IUserRepository
{
    private readonly SampleAppContext _db;

    public UsersRepository(SampleAppContext db)
    {
        _db = db;
    }

    public async Task<User> CreateUserAsync(User user)
    {
        await _db.Users.AddAsync(user);
        await _db.SaveChangesAsync();
        return user;
    }

    public async Task<List<User>> GetUsersAsync()
    {
        return await _db.Users
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<User> EditUserAsync(User user, int id)
    {
        var existing = await _db.Users.FindAsync(id);
        if (existing == null)
            throw new Exception($"Нет пользователя с id = {id}");

        _db.Users.Update(user);
        await _db.SaveChangesAsync();
        return user;
    }

    public async Task<bool> DeleteUserAsync(int id)
    {
        var user = await FindUserByIdAsync(id);
        _db.Users.Remove(user);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<User> FindUserByIdAsync(int id)
    {
        return await _db.Users.FirstOrDefaultAsync(u => u.Id == id)
               ?? throw new Exception($"Нет пользователя с id = {id}");
    }

    public async Task<User> FindUserByLoginAsync(string login)
    {
        return await _db.Users.FirstOrDefaultAsync(u => u.Login == login)
               ?? throw new Exception($"Нет пользователя с login = {login}");
    }
}
