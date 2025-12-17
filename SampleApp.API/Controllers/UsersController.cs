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
using SampleApp.API.Enums; // ✅ ДОБАВИЛ

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

        // ✅ Sprint 4: LOGIN
        // POST /api/Users/Login
        [HttpPost("Login")]
        [SwaggerOperation(Summary = "Логин по Login/Password", OperationId = "Login")]
        [SwaggerResponse(200, "Успешно", typeof(UserDto))]
        [SwaggerResponse(401, "Неверный пароль")]
        public async Task<ActionResult<UserDto>> Login([FromBody] LoginDto loginDto)
        {
            var user = await _repo.FindUserByLoginAsync(loginDto.Login);
            return CheckPasswordHash(loginDto, user);
        }

        private ActionResult<UserDto> CheckPasswordHash(LoginDto loginDto, User user)
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

            return Ok(user.ToDto());
        }

        // ✅ Создание пользователя (токен сразу сохраняем) + ✅ роль из dto.Role
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
                // RoleId по умолчанию = 3 (User) останется, если Role не пришёл
            };

            // ✅ ВОТ ЭТО ГЛАВНОЕ: если role пришла — перезаписываем RoleId
            // Поддержка:
            // "Admin"/"Manager"/"User" (любой регистр)
            // "1"/"2"/"3"
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
                // если не распознали — оставляем дефолт (User=3)
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

        [HttpGet("{id}")]
        [SwaggerOperation(Summary = "Пользователь по Id", OperationId = "GetUserById")]
        [SwaggerResponse(200, "OK", typeof(UserDto))]
        public async Task<ActionResult> GetUserById(int id)
        {
            var user = await _repo.FindUserByIdAsync(id);
            return Ok(user.ToDto());
        }
    }
}
