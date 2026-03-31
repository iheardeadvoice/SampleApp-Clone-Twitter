﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SampleApp.API.Dtos;
using SampleApp.API.Entities;
using SampleApp.API.Exceptions;
using SampleApp.API.Interfaces;
using SampleApp.API.Mappers;
using SampleApp.API.Services;
using Swashbuckle.AspNetCore.Annotations;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using SampleApp.API.Enums;

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

        private string? GetCurrentLogin()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? User.FindFirstValue(ClaimTypes.Name)
                ?? User.Identity?.Name;
        }

        [HttpPost("Login")]
        [SwaggerOperation(Summary = "Логин по Login/Password", OperationId = "Login")]
        [SwaggerResponse(200, "Успешно", typeof(UserDto))]
        [SwaggerResponse(401, "Неверный пароль")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
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

        private async Task<IActionResult> CheckPasswordHashAndUpdateToken(LoginDto loginDto, User user)
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

            user.Token = _tokenService.CreateToken(user.Login);
            await _repo.UpdateUserAsync(user);

            return Ok(user.ToDto());
        }

        [HttpPost]
        [SwaggerOperation(Summary = "Создание пользователя", OperationId = "CreateUser")]
        [SwaggerResponse(201, "Создано", typeof(UserDto))]
        public async Task<IActionResult> CreateUser([FromBody] LoginDto loginDto)
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

            if (!string.IsNullOrWhiteSpace(loginDto.Role))
            {
                var roleRaw = loginDto.Role.Trim();

                if (int.TryParse(roleRaw, out var roleIdFromClient))
                {
                    user.RoleId = roleIdFromClient;
                }
                else if (Enum.TryParse(roleRaw, ignoreCase: true, out RoleType parsedRole))
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
        public async Task<IActionResult> GetUsers()
        {
            var users = await _repo.GetUsersAsync();
            return Ok(users.Select(u => u.ToDto()));
        }

        [Authorize]
        [HttpGet("{id}")]
        [SwaggerOperation(Summary = "Пользователь по Id", OperationId = "GetUserById")]
        [SwaggerResponse(200, "OK", typeof(UserDto))]
        [SwaggerResponse(404, "Не найден")]
        public async Task<IActionResult> GetUserById(int id)
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

        [Authorize]
        [HttpPut("{id}")]
        [SwaggerOperation(Summary = "Обновление пользователя", OperationId = "UpdateUser")]
        [SwaggerResponse(200, "Пользователь обновлен", typeof(UserDto))]
        [SwaggerResponse(404, "Пользователь не найден")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserUpdateDto updateDto)
        {
            try
            {
                var existingUser = await _repo.FindUserByIdAsync(id);
                var currentLogin = GetCurrentLogin();

                if (string.IsNullOrWhiteSpace(currentLogin) ||
                    !string.Equals(currentLogin, existingUser.Login, StringComparison.OrdinalIgnoreCase))
                {
                    return Forbid();
                }

                var oldLogin = existingUser.Login;

                existingUser.Name = string.IsNullOrWhiteSpace(updateDto.Name)
                    ? existingUser.Name
                    : updateDto.Name.Trim();

                existingUser.Login = string.IsNullOrWhiteSpace(updateDto.Login)
                    ? existingUser.Login
                    : updateDto.Login.Trim();

                await _repo.EditUserAsync(existingUser, id);

                if (!string.Equals(oldLogin, existingUser.Login, StringComparison.Ordinal))
                {
                    existingUser.Token = _tokenService.CreateToken(existingUser.Login);
                    await _repo.UpdateUserAsync(existingUser);
                }

                var updatedUser = await _repo.FindUserByIdAsync(id);
                return Ok(updatedUser.ToDto());
            }
            catch (NotFoundException)
            {
                return NotFound($"Пользователь с id={id} не найден");
            }
        }

        [Authorize]
        [HttpDelete("{id}")]
        [SwaggerOperation(Summary = "Удаление пользователя", OperationId = "DeleteUser")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                var existingUser = await _repo.FindUserByIdAsync(id);
                var currentLogin = GetCurrentLogin();

                if (string.IsNullOrWhiteSpace(currentLogin) ||
                    !string.Equals(currentLogin, existingUser.Login, StringComparison.OrdinalIgnoreCase))
                {
                    return Forbid();
                }

                await _repo.DeleteUserAsync(id);
                return Ok(new { message = "Пользователь удалён" });
            }
            catch (NotFoundException)
            {
                return NotFound($"Пользователь с id={id} не найден");
            }
        }
    }
}