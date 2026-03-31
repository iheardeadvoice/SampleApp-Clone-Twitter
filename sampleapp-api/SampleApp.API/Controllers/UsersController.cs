using Microsoft.AspNetCore.Mvc;
using SampleApp.API.Dtos;
using SampleApp.API.Entities;
using SampleApp.API.Interfaces;
using SampleApp.API.Mappers;
using SampleApp.API.Services;
using Swashbuckle.AspNetCore.Annotations;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using SampleApp.API.Enums;
using SampleApp.API.Exceptions;

namespace SampleApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _repo;
        private readonly ITokenService _tokenService;

        public UsersController(IUserRepository repo, ITokenService tokenService)
        {
            _repo = repo;
            _tokenService = tokenService;
        }

        // POST /api/Users/Login
        [HttpPost("Login")]
        [SwaggerOperation(Summary = "Логин по Login/Password", OperationId = "Login")]
        [SwaggerResponse(200, "Успешно", typeof(UserDto))]
        [SwaggerResponse(401, "Неверный пароль")]
        public async Task<ActionResult<UserDto>> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                var user = await _repo.FindUserByLoginAsync(loginDto.Login);
                return await CheckPasswordHashAndUpdateToken(loginDto, user);
            }
            catch (NotFoundException)
            {
                return Unauthorized("Пользователь не найден");
            }
        }

        private async Task<ActionResult<UserDto>> CheckPasswordHashAndUpdateToken(LoginDto loginDto, User user)
        {
            using var hmac = new HMACSHA256(user.PasswordSalt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != user.PasswordHash[i])
                {
                    return Unauthorized("Неправильный пароль");
                }
            }

            // Обновляем токен при каждом входе
            user.Token = _tokenService.CreateToken(user.Login);
            await _repo.UpdateUserAsync(user);

            return Ok(user.ToDto());
        }

        // Создание пользователя
        [HttpPost]
        [SwaggerOperation(Summary = "Создание пользователя", OperationId = "CreateUser")]
        [SwaggerResponse(201, "Создано", typeof(UserDto))]
        public async Task<ActionResult> CreateUser([FromBody] LoginDto loginDto)
        {
            using var hmac = new HMACSHA256();

            var user = new User
            {
                Name = loginDto.Name,
                Login = loginDto.Login,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password)),
                PasswordSalt = hmac.Key,
                Token = _tokenService.CreateToken(loginDto.Login)
            };

            // Поддержка ролей
            if (!string.IsNullOrWhiteSpace(loginDto.Role))
            {
                var roleRaw = loginDto.Role.Trim();

                if (int.TryParse(roleRaw, out var roleIdFromClient))
                {
                    user.RoleId = roleIdFromClient;
                }
                else if (Enum.TryParse<RoleType>(roleRaw, ignoreCase: true, out var parsedRole))
                {
                    user.RoleId = (int)parsedRole;
                }
            }

            var createdUser = await _repo.CreateUserAsync(user);

            return CreatedAtAction(nameof(GetUserById), new { id = createdUser.Id }, createdUser.ToDto());
        }

        [Authorize]
        [HttpGet]
        [SwaggerOperation(Summary = "Список пользователей", OperationId = "GetUsers")]
        [SwaggerResponse(200, "OK", typeof(List<UserDto>))]
        public async Task<ActionResult> GetUsers()
        {
            var users = await _repo.GetUsersAsync();
            return Ok(users.Select(u => u.ToDto()));
        }

        [Authorize]
        [HttpGet("{id}")]
        [SwaggerOperation(Summary = "Пользователь по Id", OperationId = "GetUserById")]
        [SwaggerResponse(200, "OK", typeof(UserDto))]
        [SwaggerResponse(404, "Не найден")]
        public async Task<ActionResult> GetUserById(int id)
        {
            try
            {
                var user = await _repo.FindUserByIdAsync(id);
                return Ok(user.ToDto());
            }
            catch (NotFoundException)
            {
                return NotFound($"Пользователь с id={id} не найден");
            }
        }
    }
}