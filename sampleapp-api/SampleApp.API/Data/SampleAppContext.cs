using Microsoft.EntityFrameworkCore;
using SampleApp.API.Entities;

namespace SampleApp.API.Data;

public class SampleAppContext : DbContext
{
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Role> Roles { get; set; } = null!;
    public DbSet<Micropost> Microposts { get; set; } = null!;
    public DbSet<Relation> Relations { get; set; } = null!;

    public SampleAppContext(DbContextOptions<SampleAppContext> opt) : base(opt) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);


        // ---------- Role ----------
        modelBuilder.Entity<Role>(entity =>
        {
            entity.ToTable("Roles");
            entity.HasKey(r => r.Id);
            entity.Property(r => r.Name).IsRequired().HasMaxLength(50);
        });

        // ---------- User ----------
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("Users");

            entity.HasKey(u => u.Id);

            entity.HasIndex(u => u.Login).IsUnique();
            entity.Property(u => u.Login).IsRequired().HasMaxLength(50);

            entity.Property(u => u.Name).HasMaxLength(100);

            entity.Property(u => u.PasswordHash).IsRequired();
            entity.Property(u => u.PasswordSalt).IsRequired();

            // Token не обязательный
            entity.Property(u => u.Token).IsRequired(false);

            // User.RoleId -> Role.Id
            entity.HasOne(u => u.Role)
                  .WithMany()
                  .HasForeignKey(u => u.RoleId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // ---------- Micropost ----------
        modelBuilder.Entity<Micropost>(entity =>
        {
            entity.ToTable("Microposts");

            entity.HasKey(m => m.Id);
            entity.Property(m => m.Content).IsRequired().HasMaxLength(280);

            // Micropost.UserId -> User.Id
            entity.HasOne(m => m.User)
                  .WithMany(u => u.Microposts)
                  .HasForeignKey(m => m.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // ---------- Relation ----------
        modelBuilder.Entity<Relation>(entity =>
        {
            entity.ToTable("Relations");
            entity.HasKey(e => e.Id);

            // FK для Followed (на кого подписались)
            entity.HasOne(e => e.Followed)
                  .WithMany(u => u.FollowedRelations)
                  .HasForeignKey(e => e.FollowedId)
                  .OnDelete(DeleteBehavior.Restrict);

            // FK для Follower (кто подписался)  ✅ ВАЖНО: другая коллекция!
            entity.HasOne(e => e.Follower)
                  .WithMany(u => u.FollowerRelations)
                  .HasForeignKey(e => e.FollowerId)
                  .OnDelete(DeleteBehavior.Restrict);

            // уникальность пары (FollowerId, FollowedId)
            entity.HasIndex(e => new { e.FollowerId, e.FollowedId }).IsUnique();

            // CHECK constraint (нельзя подписаться на себя)
            entity.ToTable(t => t.HasCheckConstraint(
                "CK_Relation_SelfFollow",
                "\"FollowedId\" <> \"FollowerId\""
            ));

            entity.HasIndex(e => e.FollowerId);
            entity.HasIndex(e => e.FollowedId);
        });
    }
}