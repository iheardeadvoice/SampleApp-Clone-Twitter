namespace SampleApp.API.Entities;

public class MicropostLike : Base
{
    public int UserId { get; set; }
    public User? User { get; set; }

    public int MicropostId { get; set; }
    public Micropost? Micropost { get; set; }
}