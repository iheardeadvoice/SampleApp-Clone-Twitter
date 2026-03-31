using Microsoft.AspNetCore.Mvc;
using SampleApp.API.Entities;
using SampleApp.API.Interfaces;
using SampleApp.API.Validations;
using System.Linq;
using System.Collections.Generic;
using Swashbuckle.AspNetCore.Annotations;

namespace SampleApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RolesController : ControllerBase
    {
        private readonly IRoleRepository _repo;

        public RolesController(IRoleRepository repo)
        {
            _repo = repo;
        }

        [SwaggerOperation(
        Summary = "Добавление ролей в список",
        Description = "Добавляет роль",
        OperationId = "CreateRole"
        )]
        [SwaggerResponse(201, "Роль успешно добавлена в список", typeof(List<User>))]
        [SwaggerResponse(200, "Запрос обработан корректно", typeof(List<User>))]
        [SwaggerResponse(404, "NOT FOUND")]
        [SwaggerResponse(400, "Сервер не может обработать запрос браузера из-за некорректного синтаксиса")]
        [HttpPost]
        public ActionResult CreateRole(Role role)
        {
            var validator = new RoleValidator();
            var result = validator.Validate(role);

            if (!result.IsValid)
            {
                return BadRequest(result.Errors.First().ErrorMessage);
            }

            return Ok(_repo.CreateRole(role));
        }


        [SwaggerOperation(
        Summary = "Получение списка ролей",
        Description = "Возвращает все роли",
        OperationId = "GetRoles"
)]
        [SwaggerResponse(200, "Список ролей получен успешно", typeof(List<User>))]
        [SwaggerResponse(404, "NOT FOUND")]
        [HttpGet]
        public ActionResult GetRoles()
        {
            var roles = _repo.GetRoles();

            if (roles == null || roles.Count == 0)
                return NotFound();

            return Ok(roles);
        }


        [SwaggerOperation(
        Summary = "Получение списка ролей по определённому идентификатору",
        Description = "Осуществляет поиск по ID",
        OperationId = "GetRoleById"
)]
        [SwaggerResponse(200, "Список ролей получен успешно", typeof(List<User>))]
        [SwaggerResponse(404, "NOT FOUND")]
        [HttpGet("{id}")]
        public ActionResult GetRoleById(int id)
        {
            return Ok(_repo.FindRoleById(id));
        }


        [SwaggerOperation(
        Summary = "Создание нового ресурса | Полная замена-обновление существующего.",
        Description = "Повторные и идентичные запросы",
        OperationId = "UpdateRole"
)]
        [SwaggerResponse(200, "Список ролей получен успешно", typeof(List<User>))]
        [SwaggerResponse(201, "Роль успешно добавлена в список", typeof(List<User>))]
        [SwaggerResponse(404, "NOT FOUND")]
        [SwaggerResponse(400, "Сервер не может обработать запрос браузера из-за некорректного синтаксиса")]
        [HttpPut]
        public ActionResult UpdateRole(Role role)
        {
            return Ok(_repo.EditRole(role, role.Id));
        }


        [SwaggerOperation(
        Summary = "Удаление роли по определённому идентификатору",
        Description = "Удаление роли из списка по ID",
        OperationId = "DeleteRole"
)]
        [SwaggerResponse(404, "NOT FOUND")]
        [SwaggerResponse(400, "Сервер не может обработать запрос браузера из-за некорректного синтаксиса")]
        [SwaggerResponse(401, "Несанкционированный вход. Доступ закрыт.")]
        [SwaggerResponse(403, "Вход запрещён. Доступ закрыт.")]
        [HttpDelete("{id}")]
        public ActionResult DeleteRole(int id)
        {
            return Ok(_repo.DeleteRole(id));
        }
    }
}