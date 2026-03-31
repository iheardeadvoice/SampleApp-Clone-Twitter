using SampleApp.API.Enums;

namespace SampleApp.API.Entities;

public class User : Base
{
    public string Name { get; set; } = string.Empty;
    public string Login { get; set; } = string.Empty;
    public byte[] PasswordHash { get; set; } = Array.Empty<byte>();
    public byte[] PasswordSalt { get; set; } = Array.Empty<byte>();
    public string Token { get; set; } = string.Empty;

    public int RoleId { get; set; } = (int)RoleType.User;
    public Role? Role { get; set; }

    public ICollection<Micropost> Microposts { get; set; } = new List<Micropost>();
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public ICollection<MicropostLike> Likes { get; set; } = new List<MicropostLike>();

    public ICollection<Relation> FollowedRelations { get; set; } = new List<Relation>();
    public ICollection<Relation> FollowerRelations { get; set; } = new List<Relation>();
}