using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SampleApp.API.Dtos;
using SampleApp.API.Entities;
using SampleApp.API.Interfaces;
using SampleApp.API.Response;
using Swashbuckle.AspNetCore.Annotations;

namespace SampleApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MicropostsController(IMicropostRepository repo) : ControllerBase
{
    [SwaggerOperation(Summary = "Получение списка сообщений", OperationId = "GetMicroposts")]
    [SwaggerResponse(200, "ОК", typeof(List<Micropost>))]
    [HttpGet]
    public ActionResult<List<Micropost>> GetMicroposts()
    {
        return Ok(repo.GetMicroposts());
    }

    // ✅ создавать/менять/удалять — только авторизованным
    [Authorize]
    [SwaggerOperation(Summary = "Создание сообщения", OperationId = "CreateMicropost")]
    [SwaggerResponse(201, "Создано", typeof(Micropost))]
    [SwaggerResponse(400, "Ошибка", typeof(ErrorResponse))]
    [HttpPost]
    public ActionResult<Micropost> CreateMicropost([FromBody] MicropostDto postDto)
    {
        var post = new Micropost { Content = postDto.Content, UserId = postDto.UserId };
        var created = repo.CreateMicropost(post);
        return Created("", created);
    }

    [SwaggerOperation(Summary = "Сообщение по id", OperationId = "GetMicropost")]
    [SwaggerResponse(200, "ОК", typeof(Micropost))]
    [SwaggerResponse(404, "Не найдено", typeof(ErrorResponse))]
    [HttpGet("{id}")]
    public ActionResult<Micropost> GetMicropost(int id)
    {
        var post = repo.FindMicropostById(id);
        return Ok(post);
    }

    [Authorize]
    [SwaggerOperation(Summary = "Обновление сообщения", OperationId = "UpdateMicropost")]
    [SwaggerResponse(200, "ОК", typeof(Micropost))]
    [SwaggerResponse(404, "Не найдено", typeof(ErrorResponse))]
    [HttpPut("{id}")]
    public ActionResult<Micropost> UpdateMicropost([FromBody] EditMicropostDto dto, int id)
    {
        var edited = new Micropost { Id = id, Content = dto.Content };
        return Ok(repo.EditMicropost(edited, id));
    }

    [Authorize]
    [SwaggerOperation(Summary = "Удаление сообщения", OperationId = "DeleteMicropost")]
    [SwaggerResponse(200, "ОК", typeof(Micropost))]
    [SwaggerResponse(404, "Не найдено", typeof(ErrorResponse))]
    [HttpDelete("{id}")]
    public ActionResult<Micropost> DeleteMicropost(int id)
    {
        return Ok(repo.DeleteMicropost(id));
    }
}