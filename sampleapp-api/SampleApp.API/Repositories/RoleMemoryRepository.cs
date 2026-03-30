using System;
using System.Collections.Generic;
using System.Linq;
using SampleApp.API.Entities;
using SampleApp.API.Interfaces;

namespace SampleApp.API.Repositories
{
    public class RoleMemoryRepository : IRoleRepository
    {
        private readonly List<Role> _roles = new();

        public Role CreateRole(Role role)
        {
            _roles.Add(role);
            return role;
        }

        public bool DeleteRole(int id)
        {
            var result = _roles.FirstOrDefault(r => r.Id == id);

            if (result == null)
            {
                throw new Exception($"Нет роли с id = {id}");
            }

            _roles.Remove(result);
            return true;
        }

        public Role EditRole(Role role, int id)
        {
            var result = _roles.FirstOrDefault(r => r.Id == id);

            if (result == null)
            {
                throw new Exception($"Нет роли с id = {id}");
            }

            result.Name = role.Name;
            return result;
        }

        public Role FindRoleById(int id)
        {
            var result = _roles.FirstOrDefault(r => r.Id == id);

            if (result == null)
            {
                throw new Exception($"Нет роли с id = {id}");
            }

            return result;
        }

        public List<Role> GetRoles()
        {
            return _roles.ToList();
        }
    }
}