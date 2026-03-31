namespace SampleApp.API.Dtos;

public record UserPreviewDto(
    int Id,
    string Login,
    string Name,
    bool IsFollowing,
    int FollowersCount,
    int FollowingCount
);