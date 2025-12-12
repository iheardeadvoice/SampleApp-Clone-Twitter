using Microsoft.AspNetCore.Mvc;
using SampleApp.API.Entities;
using SampleApp.API.Interfaces;
using SampleApp.API.Validations;
using Swashbuckle.AspNetCore.Annotations;
using System.Linq;
using System.Threading.Tasks;

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

        // Задание 3: правильный статус-код 201 + валидация (Задание 1)
        [SwaggerOperation(
        Summary = "Добавление пользователей в список",
        Description = "Добавляет пользователей",
        OperationId = "CreateUser"
        )]
        [SwaggerResponse(201, "Пользователь успешно добавлен в список", typeof(List<User>))]
        [SwaggerResponse(200, "Запрос обработан корректно", typeof(List<User>))]
        [SwaggerResponse(404, "NOT FOUND")]
        [SwaggerResponse(400, "Сервер не может обработать запрос браузера из-за некорректного синтаксиса")]
        [HttpPost]
        public async Task<ActionResult> CreateUser(User user)
        {
            var validator = new UserValidator();
            var result = validator.Validate(user);

            if (!result.IsValid)
            {
                return BadRequest(result.Errors.First().ErrorMessage);
            }

            var createdUser = await _repo.CreateUserAsync(user);
            return CreatedAtAction(nameof(GetUserById), new { id = createdUser.Id }, createdUser);
        }

        [HttpGet]
        [SwaggerOperation(
        Summary = "Получение списка пользователей",
        Description = "Возвращает все пользователей",
        OperationId = "GetProducts"
)]
        [SwaggerResponse(200, "Список пользователей получен успешно", typeof(List<User>))]
        [SwaggerResponse(404, "NOT FOUND")]
        public ActionResult GetUsers()
        {
            return Ok(_repo.GetUsersAsync());
        }


        [SwaggerOperation(
        Summary = "Создание нового ресурса | Полная замена-обновление существующего.",
        Description = "Повторные и идентичные запросы",
        OperationId = "GetUsers"
)]
        [SwaggerResponse(200, "Список пользователей получен успешно", typeof(List<User>))]
        [SwaggerResponse(201, "Пользователь успешно добавлен в список", typeof(List<User>))]
        [SwaggerResponse(404, "NOT FOUND")]
        [SwaggerResponse(400, "Сервер не может обработать запрос браузера из-за некорректного синтаксиса")]
        [HttpPut]
        public async Task<ActionResult> UpdateUser(User user)
        {
            var updated = await _repo.EditUserAsync(user, user.Id);
            return Ok(updated);
        }

    
        [SwaggerOperation(
        Summary = "Получение ресурса с конкретным идентификатором",
        Description = "Получение определённых данных по ID",
        OperationId = "GetUserById"
)]
        [SwaggerResponse(404, "NOT FOUND")]
        [SwaggerResponse(400, "Сервер не может обработать запрос браузера из-за некорректного синтаксиса")]
        [SwaggerResponse(401, "Несанкционированный вход. Доступ закрыт.")]
        [SwaggerResponse(403, "Вход запрещён. Доступ закрыт.")]
        [HttpGet("{id}")]
        public async Task<ActionResult> GetUserById(int id)
        {
            var user = await _repo.FindUserByIdAsync(id);
            return Ok(user);
        }


        [SwaggerOperation(
        Summary = "Удаление пользователя по определённому идентификатору",
        Description = "Удаление пользователя из списка по ID",
        OperationId = "DeleteUser"
)]
        [SwaggerResponse(404, "NOT FOUND")]
        [SwaggerResponse(400, "Сервер не может обработать запрос браузера из-за некорректного синтаксиса")]
        [SwaggerResponse(401, "Несанкционированный вход. Доступ закрыт.")]
        [SwaggerResponse(403, "Вход запрещён. Доступ закрыт.")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUser(int id)
        {
            var deleted = await _repo.DeleteUserAsync(id);
            return Ok(deleted);
        }
    }
}