namespace SampleApp.API.Entities;

public class Comment : Base
{
    public string Content { get; set; } = string.Empty;

    public int UserId { get; set; }
    public User? User { get; set; }

    public int MicropostId { get; set; }
    public Micropost? Micropost { get; set; }
}