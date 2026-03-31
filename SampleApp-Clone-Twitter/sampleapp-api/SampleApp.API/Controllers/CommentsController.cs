using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SampleApp.API.Data;
using SampleApp.API.Dtos;
using SampleApp.API.Entities;
using Swashbuckle.AspNetCore.Annotations;
using System.Security.Claims;

namespace SampleApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CommentsController : ControllerBase
{
    private readonly SampleAppContext _db;

    public CommentsController(SampleAppContext db)
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

    [HttpGet("micropost/{micropostId:int}")]
    [SwaggerOperation(
        Summary = "Получить комментарии поста",
        Description = "Возвращает все комментарии для указанного поста."
    )]
    [SwaggerResponse(200, "Комментарии успешно получены", typeof(List<CommentDto>))]
    [SwaggerResponse(401, "Пользователь не авторизован")]
    [SwaggerResponse(404, "Пост не найден")]
    public async Task<ActionResult<List<CommentDto>>> GetCommentsByMicropost(int micropostId)
    {
        var currentUser = await GetCurrentUserAsync();
        if (currentUser is null)
            return Unauthorized();

        var postExists = await _db.Microposts.AnyAsync(p => p.Id == micropostId);
        if (!postExists)
            return NotFound("Пост не найден");

        var comments = await _db.Comments
            .AsNoTracking()
            .Where(c => c.MicropostId == micropostId)
            .OrderBy(c => c.CreatedAt)
            .Select(c => new CommentDto(
                c.Id,
                c.Content,
                c.CreatedAt,
                c.UserId,
                c.User!.Login,
                c.User!.Name,
                c.UserId == currentUser.Id
            ))
            .ToListAsync();

        return Ok(comments);
    }

    [HttpPost("micropost/{micropostId:int}")]
    [SwaggerOperation(
        Summary = "Добавить комментарий к посту",
        Description = "Создаёт новый комментарий текущего пользователя для указанного поста."
    )]
    [SwaggerResponse(200, "Комментарий успешно создан", typeof(CommentDto))]
    [SwaggerResponse(400, "Комментарий не может быть пустым")]
    [SwaggerResponse(401, "Пользователь не авторизован")]
    [SwaggerResponse(404, "Пост не найден")]
    public async Task<ActionResult<CommentDto>> CreateComment(int micropostId, [FromBody] CreateCommentDto dto)
    {
        var currentUser = await GetCurrentUserAsync();
        if (currentUser is null)
            return Unauthorized();

        if (string.IsNullOrWhiteSpace(dto.Content))
            return BadRequest("Комментарий не может быть пустым");

        var postExists = await _db.Microposts.AnyAsync(p => p.Id == micropostId);
        if (!postExists)
            return NotFound("Пост не найден");

        var comment = new Comment
        {
            Content = dto.Content.Trim(),
            MicropostId = micropostId,
            UserId = currentUser.Id,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Comments.Add(comment);
        await _db.SaveChangesAsync();

        var result = new CommentDto(
            comment.Id,
            comment.Content,
            comment.CreatedAt,
            currentUser.Id,
            currentUser.Login,
            currentUser.Name,
            true
        );

        return Ok(result);
    }

    [HttpDelete("{commentId:int}")]
    [SwaggerOperation(
        Summary = "Удалить комментарий",
        Description = "Удаляет комментарий, если он принадлежит текущему пользователю."
    )]
    [SwaggerResponse(200, "Комментарий успешно удалён")]
    [SwaggerResponse(401, "Пользователь не авторизован")]
    [SwaggerResponse(403, "Нет прав на удаление комментария")]
    [SwaggerResponse(404, "Комментарий не найден")]
    public async Task<ActionResult> DeleteComment(int commentId)
    {
        var currentUser = await GetCurrentUserAsync();
        if (currentUser is null)
            return Unauthorized();

        var comment = await _db.Comments.FirstOrDefaultAsync(c => c.Id == commentId);
        if (comment is null)
            return NotFound("Комментарий не найден");

        if (comment.UserId != currentUser.Id)
            return Forbid();

        _db.Comments.Remove(comment);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Комментарий удалён" });
    }
}