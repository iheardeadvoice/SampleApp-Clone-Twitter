namespace SampleApp.API.Dtos;

public record FollowStateDto(
    int UserId,
    bool IsFollowing,
    int FollowersCount,
    int FollowingCount
);