using Microsoft.AspNetCore.Mvc;
using SampleApp.API.Dtos;
using SampleApp.API.Entities;
using SampleApp.API.Interfaces;
using SampleApp.API.Mappers;
using Swashbuckle.AspNetCore.Annotations;
using System.Security.Cryptography;
using System.Text;

namespace SampleApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _repo;

        public UsersController(IUserRepository repo)
        {
            _repo = repo;
        }

        [SwaggerOperation(
            Summary = "Создание пользователя",
            Description = "Принимает LoginDto, создаёт User с PasswordHash/PasswordSalt и сохраняет в БД",
            OperationId = "CreateUser"
        )]
        [SwaggerResponse(201, "Пользователь успешно создан", typeof(UserDto))]
        [SwaggerResponse(400, "Ошибка валидации")]
        [HttpPost]
        public async Task<ActionResult> CreateUser([FromBody] LoginDto loginDto)
        {
            // ВАЖНО: РУЧНУЮ ВАЛИДАЦИЮ УБРАЛИ
            // FluentValidation.AspNetCore сделает 400 автоматически, если LoginDto невалидный

            using var hmac = new HMACSHA256();

            var user = new User
            {
                Name = loginDto.Name,
                Login = loginDto.Login,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password)),
                PasswordSalt = hmac.Key
            };

            var createdUser = await _repo.CreateUserAsync(user);

            return CreatedAtAction(nameof(GetUserById), new { id = createdUser.Id }, createdUser.ToDto());
        }

        [HttpGet]
        [SwaggerOperation(
            Summary = "Получение списка пользователей",
            Description = "Возвращает всех пользователей (DTO)",
            OperationId = "GetUsers"
        )]
        [SwaggerResponse(200, "Список пользователей получен успешно", typeof(List<UserDto>))]
        public async Task<ActionResult> GetUsers()
        {
            var users = await _repo.GetUsersAsync();
            return Ok(users.Select(u => u.ToDto()));
        }

        [SwaggerOperation(
            Summary = "Обновление пользователя",
            Description = "Обновляет пользователя по Id (DTO)",
            OperationId = "UpdateUser"
        )]
        [SwaggerResponse(200, "Пользователь обновлён", typeof(UserDto))]
        [HttpPut]
        public async Task<ActionResult> UpdateUser(EditUserDto editUserDto)
        {
            var currentUser = await _repo.FindUserByIdAsync(editUserDto.Id);

            currentUser.Login = editUserDto.Login;
            currentUser.Name = editUserDto.Name;

            var updated = await _repo.EditUserAsync(currentUser, currentUser.Id);

            return Ok(updated.ToDto());
        }

        [HttpGet("{id}")]
        [SwaggerOperation(
            Summary = "Получение пользователя по ID",
            Description = "Возвращает пользователя по идентификатору (DTO)",
            OperationId = "GetUserById"
        )]
        [SwaggerResponse(200, "Пользователь найден", typeof(UserDto))]
        public async Task<ActionResult> GetUserById(int id)
        {
            var user = await _repo.FindUserByIdAsync(id);
            return Ok(user.ToDto());
        }

        [HttpDelete("{id}")]
        [SwaggerOperation(
            Summary = "Удаление пользователя по ID",
            Description = "Удаляет пользователя по идентификатору",
            OperationId = "DeleteUser"
        )]
        [SwaggerResponse(200, "Пользователь удалён")]
        public async Task<ActionResult> DeleteUser(int id)
        {
            var deleted = await _repo.DeleteUserAsync(id);
            return Ok(deleted);
        }
    }
}
