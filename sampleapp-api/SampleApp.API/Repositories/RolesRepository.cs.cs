using Microsoft.EntityFrameworkCore;
using SampleApp.API.Data;
using SampleApp.API.Entities;
using SampleApp.API.Exceptions;
using SampleApp.API.Interfaces;

namespace SampleApp.API.Repositories;

public class RolesRepository : IRoleRepository
{
    private readonly SampleAppContext _db;

    public RolesRepository(SampleAppContext db)
    {
        _db = db;
    }

    public Role CreateRole(Role role)
    {
        _db.Roles.Add(role);
        _db.SaveChanges();
        return role;
    }

    public List<Role> GetRoles()
    {
        return _db.Roles.AsNoTracking().OrderBy(r => r.Id).ToList();
    }

    public Role EditRole(Role role, int id)
    {
        var existing = _db.Roles.Find(id);
        if (existing is null)
            throw new NotFoundException($"Нет роли с id={id}");

        existing.Name = role.Name;
        existing.UpdatedAt = DateTime.UtcNow;
        _db.SaveChanges();
        return existing;
    }

    public bool DeleteRole(int id)
    {
        var role = _db.Roles.Find(id);
        if (role is null)
            throw new NotFoundException($"Нет роли с id={id}");

        _db.Roles.Remove(role);
        _db.SaveChanges();
        return true;
    }

    public Role FindRoleById(int id)
    {
        var role = _db.Roles.AsNoTracking().FirstOrDefault(r => r.Id == id);
        if (role is null)
            throw new NotFoundException($"Нет роли с id={id}");

        return role;
    }
}
