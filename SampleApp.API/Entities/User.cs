using SampleApp.API.Enums;
namespace SampleApp.API.Entities;

public class User : Base
{
    public string Name { get; set; } = string.Empty;
    public required string Login { get; set; }
    public required byte[] PasswordHash { get; set; }
    public required byte[] PasswordSalt { get; set; }
    public string Token { get; set; } = string.Empty;

    public int RoleId { get; set; } = (int)RoleType.User;
    public Role? Role { get; set; }

    public IEnumerable<Micropost>? Microposts { get; set; }

    public ICollection<Relation> FollowedRelations { get; set; } = new List<Relation>();
    public ICollection<Relation>? FollowerRelations { get; set; }



}
