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
public class FeedController : ControllerBase
{
    private readonly SampleAppContext _db;

    public FeedController(SampleAppContext db)
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

        return await _db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Login == login);
    }

    private IQueryable<FeedMicropostDto> BuildPostQuery(IQueryable<Micropost> source, int currentUserId)
    {
        return source
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new FeedMicropostDto(
                p.Id,
                p.Content,
                p.CreatedAt,
                p.UpdatedAt,
                new PostAuthorDto(
                    p.UserId,
                    p.User!.Login,
                    p.User!.Name
                ),
                p.Likes.Count(),
                p.Comments.Count(),
                p.Likes.Any(l => l.UserId == currentUserId),
                p.UserId == currentUserId
            ));
    }

    [HttpGet]
    [SwaggerOperation(
        Summary = "Получить персональную ленту",
        Description = "Возвращает посты текущего пользователя и посты тех пользователей, на кого он подписан."
    )]
    [SwaggerResponse(200, "Лента успешно получена", typeof(List<FeedMicropostDto>))]
    [SwaggerResponse(401, "Пользователь не авторизован")]
    public async Task<ActionResult<List<FeedMicropostDto>>> GetFeed()
    {
        var currentUser = await GetCurrentUserAsync();
        if (currentUser is null)
            return Unauthorized();

        var followedIds = await _db.Relations
            .AsNoTracking()
            .Where(r => r.FollowerId == currentUser.Id)
            .Select(r => r.FollowedId)
            .ToListAsync();

        followedIds.Add(currentUser.Id);

        var posts = await BuildPostQuery(
                _db.Microposts.AsNoTracking().Where(p => followedIds.Contains(p.UserId)),
                currentUser.Id
            )
            .ToListAsync();

        return Ok(posts);
    }

    [HttpGet("user/{userId:int}")]
    [SwaggerOperation(
        Summary = "Получить посты пользователя",
        Description = "Возвращает все посты конкретного пользователя по его идентификатору."
    )]
    [SwaggerResponse(200, "Посты пользователя успешно получены", typeof(List<FeedMicropostDto>))]
    [SwaggerResponse(401, "Пользователь не авторизован")]
    [SwaggerResponse(404, "Пользователь не найден")]
    public async Task<ActionResult<List<FeedMicropostDto>>> GetUserFeed(int userId)
    {
        var currentUser = await GetCurrentUserAsync();
        if (currentUser is null)
            return Unauthorized();

        var userExists = await _db.Users.AnyAsync(u => u.Id == userId);
        if (!userExists)
            return NotFound("Пользователь не найден");

        var posts = await BuildPostQuery(
                _db.Microposts.AsNoTracking().Where(p => p.UserId == userId),
                currentUser.Id
            )
            .ToListAsync();

        return Ok(posts);
    }
}