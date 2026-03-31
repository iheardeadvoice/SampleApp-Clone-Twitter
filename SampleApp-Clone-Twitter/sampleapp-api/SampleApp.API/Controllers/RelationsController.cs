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
public class RelationsController : ControllerBase
{
    private readonly SampleAppContext _db;

    public RelationsController(SampleAppContext db)
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

    [HttpGet("followers/{userId:int}")]
    [SwaggerOperation(
        Summary = "Получить подписчиков пользователя",
        Description = "Возвращает список пользователей, которые подписаны на указанного пользователя."
    )]
    [SwaggerResponse(200, "Список подписчиков успешно получен", typeof(List<UserPreviewDto>))]
    [SwaggerResponse(401, "Пользователь не авторизован")]
    public async Task<ActionResult<List<UserPreviewDto>>> GetFollowers(int userId)
    {
        var currentUser = await GetCurrentUserAsync();
        if (currentUser is null)
            return Unauthorized();

        var users = await _db.Relations
            .AsNoTracking()
            .Where(r => r.FollowedId == userId)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new UserPreviewDto(
                r.FollowerId,
                r.Follower!.Login,
                r.Follower!.Name,
                _db.Relations.Any(x => x.FollowerId == currentUser.Id && x.FollowedId == r.FollowerId),
                _db.Relations.Count(x => x.FollowedId == r.FollowerId),
                _db.Relations.Count(x => x.FollowerId == r.FollowerId)
            ))
            .ToListAsync();

        return Ok(users);
    }

    [HttpGet("following/{userId:int}")]
    [SwaggerOperation(
        Summary = "Получить подписки пользователя",
        Description = "Возвращает список пользователей, на которых подписан указанный пользователь."
    )]
    [SwaggerResponse(200, "Список подписок успешно получен", typeof(List<UserPreviewDto>))]
    [SwaggerResponse(401, "Пользователь не авторизован")]
    public async Task<ActionResult<List<UserPreviewDto>>> GetFollowing(int userId)
    {
        var currentUser = await GetCurrentUserAsync();
        if (currentUser is null)
            return Unauthorized();

        var users = await _db.Relations
            .AsNoTracking()
            .Where(r => r.FollowerId == userId)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new UserPreviewDto(
                r.FollowedId,
                r.Followed!.Login,
                r.Followed!.Name,
                _db.Relations.Any(x => x.FollowerId == currentUser.Id && x.FollowedId == r.FollowedId),
                _db.Relations.Count(x => x.FollowedId == r.FollowedId),
                _db.Relations.Count(x => x.FollowerId == r.FollowedId)
            ))
            .ToListAsync();

        return Ok(users);
    }

    [HttpGet("state/{userId:int}")]
    [SwaggerOperation(
        Summary = "Получить статус подписки",
        Description = "Показывает, подписан ли текущий пользователь на указанного пользователя, а также количество подписчиков и подписок."
    )]
    [SwaggerResponse(200, "Статус подписки успешно получен", typeof(FollowStateDto))]
    [SwaggerResponse(401, "Пользователь не авторизован")]
    [SwaggerResponse(404, "Пользователь не найден")]
    public async Task<ActionResult<FollowStateDto>> GetFollowState(int userId)
    {
        var currentUser = await GetCurrentUserAsync();
        if (currentUser is null)
            return Unauthorized();

        var userExists = await _db.Users.AnyAsync(u => u.Id == userId);
        if (!userExists)
            return NotFound("Пользователь не найден");

        var isFollowing = await _db.Relations.AnyAsync(r =>
            r.FollowerId == currentUser.Id && r.FollowedId == userId);

        var followersCount = await _db.Relations.CountAsync(r => r.FollowedId == userId);
        var followingCount = await _db.Relations.CountAsync(r => r.FollowerId == userId);

        return Ok(new FollowStateDto(userId, isFollowing, followersCount, followingCount));
    }

    [HttpPost("follow/{followedId:int}")]
    [SwaggerOperation(
        Summary = "Подписаться на пользователя",
        Description = "Создаёт подписку текущего пользователя на указанного пользователя."
    )]
    [SwaggerResponse(200, "Подписка успешно создана", typeof(FollowStateDto))]
    [SwaggerResponse(400, "Нельзя подписаться на самого себя")]
    [SwaggerResponse(401, "Пользователь не авторизован")]
    [SwaggerResponse(404, "Пользователь не найден")]
    public async Task<ActionResult<FollowStateDto>> FollowUser(int followedId)
    {
        var currentUser = await GetCurrentUserAsync();
        if (currentUser is null)
            return Unauthorized();

        if (currentUser.Id == followedId)
            return BadRequest("Нельзя подписаться на самого себя");

        var targetUser = await _db.Users.FirstOrDefaultAsync(u => u.Id == followedId);
        if (targetUser is null)
            return NotFound("Пользователь не найден");

        var exists = await _db.Relations.AnyAsync(r =>
            r.FollowerId == currentUser.Id && r.FollowedId == followedId);

        if (!exists)
        {
            _db.Relations.Add(new Relation(currentUser.Id, followedId));
            await _db.SaveChangesAsync();
        }

        var followersCount = await _db.Relations.CountAsync(r => r.FollowedId == followedId);
        var followingCount = await _db.Relations.CountAsync(r => r.FollowerId == followedId);

        return Ok(new FollowStateDto(followedId, true, followersCount, followingCount));
    }

    [HttpDelete("follow/{followedId:int}")]
    [SwaggerOperation(
        Summary = "Отписаться от пользователя",
        Description = "Удаляет подписку текущего пользователя на указанного пользователя."
    )]
    [SwaggerResponse(200, "Подписка успешно удалена", typeof(FollowStateDto))]
    [SwaggerResponse(401, "Пользователь не авторизован")]
    public async Task<ActionResult<FollowStateDto>> UnfollowUser(int followedId)
    {
        var currentUser = await GetCurrentUserAsync();
        if (currentUser is null)
            return Unauthorized();

        var relation = await _db.Relations.FirstOrDefaultAsync(r =>
            r.FollowerId == currentUser.Id && r.FollowedId == followedId);

        if (relation is not null)
        {
            _db.Relations.Remove(relation);
            await _db.SaveChangesAsync();
        }

        var followersCount = await _db.Relations.CountAsync(r => r.FollowedId == followedId);
        var followingCount = await _db.Relations.CountAsync(r => r.FollowerId == followedId);

        return Ok(new FollowStateDto(followedId, false, followersCount, followingCount));
    }
}