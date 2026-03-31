namespace SampleApp.API.Entities;

public class Micropost : Base
{
    public string Content { get; set; } = string.Empty;

    public int UserId { get; set; }
    public User? User { get; set; }

    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public ICollection<MicropostLike> Likes { get; set; } = new List<MicropostLike>();
}