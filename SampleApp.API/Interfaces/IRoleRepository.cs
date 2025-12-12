using System.Collections.Generic;
using SampleApp.API.Entities;

namespace SampleApp.API.Interfaces
{
    public interface IRoleRepository
    {
        Role CreateRole(Role role);
        List<Role> GetRoles();
        Role EditRole(Role role, int id);
        bool DeleteRole(int id);
        Role FindRoleById(int id);
    }
}