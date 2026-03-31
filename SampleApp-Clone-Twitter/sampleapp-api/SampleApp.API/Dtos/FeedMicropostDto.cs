namespace SampleApp.API.Dtos;

public record FeedMicropostDto(
    int Id,
    string Content,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    PostAuthorDto Author,
    int LikeCount,
    int CommentCount,
    bool IsLikedByCurrentUser,
    bool IsOwner
);