﻿using Microsoft.EntityFrameworkCore;
using SampleApp.API.Entities;

namespace SampleApp.API.Data;

public class SampleAppContext : DbContext
{
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Role> Roles { get; set; } = null!;
    public DbSet<Micropost> Microposts { get; set; } = null!;
    public DbSet<Relation> Relations { get; set; } = null!;
    public DbSet<Comment> Comments { get; set; } = null!;
    public DbSet<MicropostLike> MicropostLikes { get; set; } = null!;

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
            entity.ToTable("Users");

            entity.HasKey(u => u.Id);

            entity.HasIndex(u => u.Login).IsUnique();
            entity.Property(u => u.Login).IsRequired().HasMaxLength(50);
            entity.Property(u => u.Name).HasMaxLength(100);
            entity.Property(u => u.PasswordHash).IsRequired();
            entity.Property(u => u.PasswordSalt).IsRequired();
            entity.Property(u => u.Token).IsRequired(false);

            entity.HasOne(u => u.Role)
                  .WithMany()
                  .HasForeignKey(u => u.RoleId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Micropost>(entity =>
        {
            entity.ToTable("Microposts");

            entity.HasKey(m => m.Id);
            entity.Property(m => m.Content).IsRequired().HasMaxLength(280);

            entity.HasOne(m => m.User)
                  .WithMany(u => u.Microposts)
                  .HasForeignKey(m => m.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(m => m.UserId);
            entity.HasIndex(m => m.CreatedAt);
        });

        modelBuilder.Entity<Comment>(entity =>
        {
            entity.ToTable("Comments");

            entity.HasKey(c => c.Id);
            entity.Property(c => c.Content).IsRequired().HasMaxLength(280);

            entity.HasOne(c => c.User)
                  .WithMany(u => u.Comments)
                  .HasForeignKey(c => c.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(c => c.Micropost)
                  .WithMany(m => m.Comments)
                  .HasForeignKey(c => c.MicropostId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(c => c.UserId);
            entity.HasIndex(c => c.MicropostId);
            entity.HasIndex(c => c.CreatedAt);
        });

        modelBuilder.Entity<MicropostLike>(entity =>
        {
            entity.ToTable("MicropostLikes");

            entity.HasKey(l => l.Id);

            entity.HasOne(l => l.User)
                  .WithMany(u => u.Likes)
                  .HasForeignKey(l => l.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(l => l.Micropost)
                  .WithMany(m => m.Likes)
                  .HasForeignKey(l => l.MicropostId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(l => l.UserId);
            entity.HasIndex(l => l.MicropostId);
            entity.HasIndex(l => new { l.UserId, l.MicropostId }).IsUnique();
        });

        modelBuilder.Entity<Relation>(entity =>
        {
            entity.ToTable("Relations");
            entity.HasKey(e => e.Id);

            entity.HasOne(e => e.Followed)
                  .WithMany(u => u.FollowerRelations)
                  .HasForeignKey(e => e.FollowedId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Follower)
                  .WithMany(u => u.FollowedRelations)
                  .HasForeignKey(e => e.FollowerId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(e => new { e.FollowerId, e.FollowedId }).IsUnique();

            entity.ToTable(t => t.HasCheckConstraint(
                "CK_Relation_SelfFollow",
                "\"FollowedId\" <> \"FollowerId\""
            ));

            entity.HasIndex(e => e.FollowerId);
            entity.HasIndex(e => e.FollowedId);
        });
    }
}