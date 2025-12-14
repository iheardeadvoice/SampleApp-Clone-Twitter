using Microsoft.EntityFrameworkCore;
using SampleApp.API.Entities;

namespace SampleApp.API.Data;

public class SampleAppContext : DbContext
{
    public DbSet<User> Users { get; set; } = null!;

    public SampleAppContext(DbContextOptions<SampleAppContext> opt) : base(opt) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.HasIndex(e => e.Login).IsUnique();

            entity.Property(e => e.Login)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(e => e.Name)
                .HasMaxLength(100);

            entity.Property(e => e.PasswordHash).IsRequired();
            entity.Property(e => e.PasswordSalt).IsRequired();
            entity.Property(e => e.Token).IsRequired();
        });
    }
}
