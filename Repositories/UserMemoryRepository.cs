using System;
using System.Collections.Generic;
using System.Linq;
using SampleApp.API.Entities;
using SampleApp.API.Interfaces;

namespace SampleApp.API.Repositories
{
    public class UsersMemoryRepository : IUserRepository
    {
        public List<User> Users { get; set; } = new List<User>();

        public User CreateUser(User user)
        {
            Users.Add(user);
            return user;
        }

        public bool DeleteUser(int id)
        {
            var result = FindUserById(id);
            Users.Remove(result);
            return true;
        }

        public User EditUser(User user, int id)
        {
            var result = FindUserById(id);
            result.Name = user.Name;
            return result;
        }

        public User FindUserById(int id)
        {
            var result = Users.Where(u => u.Id == id).FirstOrDefault();

            if (result == null)
            {
                throw new Exception($"Нет пользователя с id = {id}");
            }

            return result;
        }

        public List<User> GetUsers()
        {
            return Users;
        }
    }
}
