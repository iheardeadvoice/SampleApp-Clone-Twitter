using System.Collections.Generic;
using System.Threading.Tasks;
using SampleApp.API.Entities;

namespace SampleApp.API.Interfaces
{
    public interface IUserRepository
    {
        Task<User> CreateUserAsync(User user);
        Task<List<User>> GetUsersAsync();
        Task<User> EditUserAsync(User user, int id);
        Task<bool> DeleteUserAsync(int id);
        Task<User> FindUserByIdAsync(int id);
        Task<User> FindUserByLoginAsync(string login);
        
    }
}