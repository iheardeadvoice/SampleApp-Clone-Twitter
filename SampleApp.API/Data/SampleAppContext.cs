using Microsoft.EntityFrameworkCore;
using SampleApp.API.Entities;

namespace SampleApp.API.Data;

public class SampleAppContext : DbContext
{
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Role> Roles { get; set; } = null!;
    public DbSet<Micropost> Microposts { get; set; } = null!;
    

    public SampleAppContext(DbContextOptions<SampleAppContext> opt) : base(opt) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Role>(entity =>
        {
            entity.ToTable("Roles");
            entity.HasKey(r => r.Id);
            entity.Property(r => r.Name).IsRequired().HasMaxLength(50);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id);

            entity.HasIndex(u => u.Login).IsUnique();
            entity.Property(u => u.Login).IsRequired().HasMaxLength(50);

            entity.Property(u => u.Name).HasMaxLength(100);

            entity.Property(u => u.PasswordHash).IsRequired();
            entity.Property(u => u.PasswordSalt).IsRequired();

            // ❗ Token лучше сделать НЕ обязательным в БД (иначе старые записи ломают миграции)
            entity.Property(u => u.Token).IsRequired(false);

            // ✅ User.RoleId -> Role.Id (одна нормальная связь)
            entity.HasOne(u => u.Role)
                  .WithMany()
                  .HasForeignKey(u => u.RoleId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Micropost>(entity =>
        {
            entity.HasKey(m => m.Id);
            entity.Property(m => m.Content).IsRequired().HasMaxLength(280);

            // ✅ Micropost.UserId -> User.Id
            entity.HasOne(m => m.User)
                  .WithMany(u => u.Microposts)
                  .HasForeignKey(m => m.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}