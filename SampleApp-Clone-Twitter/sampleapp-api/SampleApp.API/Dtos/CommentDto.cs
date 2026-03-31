namespace SampleApp.API.Dtos;

public record CommentDto(
    int Id,
    string Content,
    DateTime CreatedAt,
    int UserId,
    string UserLogin,
    string UserName,
    bool IsOwner
);