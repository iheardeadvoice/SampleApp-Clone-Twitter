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
public class LikesController : ControllerBase
{
    private readonly SampleAppContext _db;

    public LikesController(SampleAppContext db)
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

    [HttpGet("{micropostId:int}")]
    [SwaggerOperation(
        Summary = "Получить состояние лайка",
        Description = "Возвращает, поставил ли текущий пользователь лайк посту, и общее количество лайков."
    )]
    [SwaggerResponse(200, "Информация о лайках успешно получена", typeof(ToggleLikeResultDto))]
    [SwaggerResponse(401, "Пользователь не авторизован")]
    [SwaggerResponse(404, "Пост не найден")]
    public async Task<ActionResult<ToggleLikeResultDto>> GetLikeState(int micropostId)
    {
        var currentUser = await GetCurrentUserAsync();
        if (currentUser is null)
            return Unauthorized();

        var postExists = await _db.Microposts.AnyAsync(p => p.Id == micropostId);
        if (!postExists)
            return NotFound("Пост не найден");

        var isLiked = await _db.MicropostLikes.AnyAsync(l =>
            l.MicropostId == micropostId && l.UserId == currentUser.Id);

        var likeCount = await _db.MicropostLikes.CountAsync(l => l.MicropostId == micropostId);

        return Ok(new ToggleLikeResultDto(isLiked, likeCount));
    }

    [HttpPost("{micropostId:int}")]
    [SwaggerOperation(
        Summary = "Переключить лайк у поста",
        Description = "Если лайк уже стоит, он удаляется. Если лайка нет, он добавляется."
    )]
    [SwaggerResponse(200, "Лайк успешно переключён", typeof(ToggleLikeResultDto))]
    [SwaggerResponse(401, "Пользователь не авторизован")]
    [SwaggerResponse(404, "Пост не найден")]
    public async Task<ActionResult<ToggleLikeResultDto>> ToggleLike(int micropostId)
    {
        var currentUser = await GetCurrentUserAsync();
        if (currentUser is null)
            return Unauthorized();

        var postExists = await _db.Microposts.AnyAsync(p => p.Id == micropostId);
        if (!postExists)
            return NotFound("Пост не найден");

        var existingLike = await _db.MicropostLikes.FirstOrDefaultAsync(l =>
            l.MicropostId == micropostId && l.UserId == currentUser.Id);

        bool isLikedNow;

        if (existingLike is null)
        {
            _db.MicropostLikes.Add(new MicropostLike
            {
                MicropostId = micropostId,
                UserId = currentUser.Id,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });

            isLikedNow = true;
        }
        else
        {
            _db.MicropostLikes.Remove(existingLike);
            isLikedNow = false;
        }

        await _db.SaveChangesAsync();

        var likeCount = await _db.MicropostLikes.CountAsync(l => l.MicropostId == micropostId);
        return Ok(new ToggleLikeResultDto(isLikedNow, likeCount));
    }
}