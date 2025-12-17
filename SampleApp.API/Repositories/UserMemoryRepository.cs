using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SampleApp.API.Entities;
using SampleApp.API.Interfaces;

namespace SampleApp.API.Repositories
{
    public class UsersMemoryRepository : IUserRepository
    {
        private readonly List<User> _users = new();

        public Task<User> CreateUserAsync(User user)
        {
            _users.Add(user);
            return Task.FromResult(user);
        }

        public Task<bool> DeleteUserAsync(int id)
        {
            var result = _users.FirstOrDefault(u => u.Id == id);

            if (result == null)
            {
                throw new Exception($"Нет пользователя с id = {id}");
            }

            _users.Remove(result);
            return Task.FromResult(true);
        }

        public Task<User> EditUserAsync(User user, int id)
        {
            var result = _users.FirstOrDefault(u => u.Id == id);

            if (result == null)
            {
                throw new Exception($"Нет пользователя с id = {id}");
            }

            result.Name = user.Name;
            return Task.FromResult(result);
        }

        public Task<User> FindUserByIdAsync(int id)
        {
            var result = _users.FirstOrDefault(u => u.Id == id);

            if (result == null)
            {
                throw new Exception($"Нет пользователя с id = {id}");
            }

            return Task.FromResult(result);
        }

        public Task<User> FindUserByLoginAsync(string login)
        {
            // Логина у нас нет, это просто заглушка для задания
            var user = _users.FirstOrDefault(u => u.Login == login);
            if (user == null)
                throw new Exception($"Нет пользователя с login = {login}");
            return Task.FromResult(user);
        }

        public Task<List<User>> GetUsersAsync()
        {
            // пока все пользователи, без фильтров
            return Task.FromResult(_users.ToList());
        }
    }
}