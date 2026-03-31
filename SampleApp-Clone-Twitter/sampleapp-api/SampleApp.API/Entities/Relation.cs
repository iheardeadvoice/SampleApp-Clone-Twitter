namespace SampleApp.API.Entities;

public class Relation : Base
{
    public User? Followed { get; set; }
    public int FollowedId { get; set; }

    public User? Follower { get; set; }
    public int FollowerId { get; set; }

    public Relation() { }
    public Relation(int followerId, int followedId)
    {
        FollowedId = followedId;
        FollowerId = followerId;

        if (FollowedId == FollowerId)
            throw new Exception("Пользователь не может быть подписан сам на себя");
    }

}