using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SampleApp.API.Data;
using SampleApp.API.Dtos;
using SampleApp.API.Entities;
using SampleApp.API.Response;
using Swashbuckle.AspNetCore.Annotations;
using System.Security.Claims;

namespace SampleApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MicropostsController : ControllerBase
{
    private readonly SampleAppContext _db;

    public MicropostsController(SampleAppContext db)
    {
        _db = db;
    }

    private async Task<User?> GetCurrentUserAsync()
    {
        var login = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue(ClaimTypes.Name)
            ?? User.Identity?.Name;

        if (string.IsNullOrWhiteSpace(login))
            return null;

        return await _db.Users.FirstOrDefaultAsync(u => u.Login == login);
    }

    [HttpGet]
    [SwaggerOperation(
        Summary = "Получить список всех постов",
        Description = "Возвращает все посты из системы в порядке от новых к старым."
    )]
    [SwaggerResponse(200, "Список постов успешно получен", typeof(List<Micropost>))]
    public async Task<ActionResult<List<Micropost>>> GetMicroposts()
    {
        var posts = await _db.Microposts
            .AsNoTracking()
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        return Ok(posts);
    }

    [Authorize]
    [HttpPost]
    [SwaggerOperation(
        Summary = "Создать пост",
        Description = "Создаёт новый пост от имени текущего авторизованного пользователя."
    )]
    [SwaggerResponse(201, "Пост успешно создан", typeof(Micropost))]
    [SwaggerResponse(400, "Текст поста обязателен")]
    [SwaggerResponse(401, "Пользователь не авторизован")]
    public async Task<ActionResult<Micropost>> CreateMicropost([FromBody] MicropostDto postDto)
    {
        var currentUser = await GetCurrentUserAsync();
        if (currentUser is null)
            return Unauthorized();

        if (string.IsNullOrWhiteSpace(postDto.Content))
        {
            return BadRequest(new ErrorResponse("400", "Текст поста обязателен"));
        }

        var post = new Micropost
        {
            Content = postDto.Content.Trim(),
            UserId = currentUser.Id,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Microposts.Add(post);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetMicropost), new { id = post.Id }, post);
    }

    [HttpGet("{id}")]
    [SwaggerOperation(
        Summary = "Получить пост по id",
        Description = "Возвращает один пост по его идентификатору."
    )]
    [SwaggerResponse(200, "Пост успешно получен", typeof(Micropost))]
    [SwaggerResponse(404, "Пост не найден")]
    public async Task<ActionResult<Micropost>> GetMicropost(int id)
    {
        var post = await _db.Microposts
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id);

        if (post is null)
            return NotFound(new ErrorResponse("404", $"Нет сообщения c id = {id}"));

        return Ok(post);
    }

    [Authorize]
    [HttpPut("{id}")]
    [SwaggerOperation(
        Summary = "Обновить пост",
        Description = "Обновляет текст поста, если пост принадлежит текущему пользователю."
    )]
    [SwaggerResponse(200, "Пост успешно обновлён", typeof(Micropost))]
    [SwaggerResponse(400, "Текст поста обязателен")]
    [SwaggerResponse(401, "Пользователь не авторизован")]
    [SwaggerResponse(403, "Нет прав на изменение поста")]
    [SwaggerResponse(404, "Пост не найден")]
    public async Task<ActionResult<Micropost>> UpdateMicropost([FromBody] EditMicropostDto dto, int id)
    {
        var currentUser = await GetCurrentUserAsync();
        if (currentUser is null)
            return Unauthorized();

        var post = await _db.Microposts.FirstOrDefaultAsync(p => p.Id == id);
        if (post is null)
            return NotFound(new ErrorResponse("404", $"Нет сообщения c id = {id}"));

        if (post.UserId != currentUser.Id)
            return Forbid();

        if (string.IsNullOrWhiteSpace(dto.Content))
            return BadRequest(new ErrorResponse("400", "Текст поста обязателен"));

        post.Content = dto.Content.Trim();
        post.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(post);
    }

    [Authorize]
    [HttpDelete("{id}")]
    [SwaggerOperation(
        Summary = "Удалить пост",
        Description = "Удаляет пост, если он принадлежит текущему пользователю."
    )]
    [SwaggerResponse(200, "Пост успешно удалён")]
    [SwaggerResponse(401, "Пользователь не авторизован")]
    [SwaggerResponse(403, "Нет прав на удаление поста")]
    [SwaggerResponse(404, "Пост не найден")]
    public async Task<ActionResult> DeleteMicropost(int id)
    {
        var currentUser = await GetCurrentUserAsync();
        if (currentUser is null)
            return Unauthorized();

        var post = await _db.Microposts.FirstOrDefaultAsync(p => p.Id == id);
        if (post is null)
            return NotFound(new ErrorResponse("404", $"Нет сообщения c id = {id}"));

        if (post.UserId != currentUser.Id)
            return Forbid();

        _db.Microposts.Remove(post);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Пост удалён" });
    }
}