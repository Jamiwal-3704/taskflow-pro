using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using TaskFlowPro.API.Models;

namespace TaskFlowPro.API.Data
{
    public class AppDbContext : IdentityDbContext<AppUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<UserProfile> UserProfiles { get; set; }
        public DbSet<TodoList> TodoLists { get; set; }
        public DbSet<TodoTask> TodoTasks { get; set; }
        public DbSet<TodoSubtask> TodoSubtasks { get; set; }
        public DbSet<UserListPreference> UserListPreferences { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }

        // Workout Tracker Tables
        public DbSet<WorkoutTemplate> WorkoutTemplates { get; set; }
        public DbSet<WorkoutExercise> WorkoutExercises { get; set; }
        public DbSet<WorkoutSession> WorkoutSessions { get; set; }
        public DbSet<WorkoutLoggedExercise> WorkoutLoggedExercises { get; set; }
        public DbSet<WorkoutSetLog> WorkoutSetLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // AppUser and UserProfile (One-to-One)
            builder.Entity<AppUser>()
                .HasOne(u => u.Profile)
                .WithOne(p => p.User)
                .HasForeignKey<UserProfile>(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // TodoList relationships
            builder.Entity<TodoList>()
                .HasOne(l => l.Owner)
                .WithMany(u => u.Lists)
                .HasForeignKey(l => l.OwnerId)
                .OnDelete(DeleteBehavior.Cascade);

            // TodoTask relationship
            builder.Entity<TodoTask>()
                .HasOne(t => t.List)
                .WithMany(l => l.Tasks)
                .HasForeignKey(t => t.ListId)
                .OnDelete(DeleteBehavior.Cascade);

            // TodoSubtask relationship
            builder.Entity<TodoSubtask>()
                .HasOne(s => s.Task)
                .WithMany(t => t.SubTasks)
                .HasForeignKey(s => s.TaskId)
                .OnDelete(DeleteBehavior.Cascade);

            // WorkoutSession relationship
            builder.Entity<WorkoutSession>()
                .HasOne(s => s.List)
                .WithMany(l => l.WorkoutSessions)
                .HasForeignKey(s => s.ListId)
                .OnDelete(DeleteBehavior.Cascade);

            // WorkoutLoggedExercise relationships
            builder.Entity<WorkoutLoggedExercise>()
                .HasOne(c => c.Session)
                .WithMany(s => s.LoggedExercises)
                .HasForeignKey(c => c.SessionId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<WorkoutLoggedExercise>()
                .HasOne(c => c.Exercise)
                .WithMany()
                .HasForeignKey(c => c.ExerciseId)
                .OnDelete(DeleteBehavior.Restrict);

            // WorkoutSetLog relationship
            builder.Entity<WorkoutSetLog>()
                .HasOne(log => log.LoggedExercise)
                .WithMany(c => c.SetLogs)
                .HasForeignKey(log => log.LoggedExerciseId)
                .OnDelete(DeleteBehavior.Cascade);

            // Seed Workout Tracker Template
            var templateId = Guid.Parse("c3a647db-d8fc-4235-824f-ef7ebf836dfc");
            builder.Entity<WorkoutTemplate>().HasData(new WorkoutTemplate
            {
                Id = templateId,
                Name = "Gym Workout Tracker",
                Description = "Track sets, reps, and calculate total lifting volume for Chest, Back, and Legs.",
                Icon = "Dumbbell",
                CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            });

            // Seed Workout Exercises (Chest, Back, Legs)
            builder.Entity<WorkoutExercise>().HasData(
                new WorkoutExercise
                {
                    Id = Guid.Parse("28682a0e-94ec-4ca4-86a0-ea0409a805c8"),
                    TemplateId = templateId,
                    Name = "Bench Press",
                    Category = "Chest",
                    MetricLabel1 = "Weight (kg)",
                    MetricLabel2 = "Reps",
                    SortOrder = 1
                },
                new WorkoutExercise
                {
                    Id = Guid.Parse("7b5394be-b333-4074-be46-4cb0a4c0bf49"),
                    TemplateId = templateId,
                    Name = "Incline Press",
                    Category = "Chest",
                    MetricLabel1 = "Weight (kg)",
                    MetricLabel2 = "Reps",
                    SortOrder = 2
                },
                new WorkoutExercise
                {
                    Id = Guid.Parse("b8719bc4-3b2d-4db7-a4b7-5a1bf2f4e3c3"),
                    TemplateId = templateId,
                    Name = "Decline Press",
                    Category = "Chest",
                    MetricLabel1 = "Weight (kg)",
                    MetricLabel2 = "Reps",
                    SortOrder = 3
                },
                new WorkoutExercise
                {
                    Id = Guid.Parse("70f5e7f1-bc8e-49b0-9515-566b6070a2a4"),
                    TemplateId = templateId,
                    Name = "Chest Dips",
                    Category = "Chest",
                    MetricLabel1 = "Weight (kg)",
                    MetricLabel2 = "Reps",
                    SortOrder = 4
                },
                new WorkoutExercise
                {
                    Id = Guid.Parse("9876251b-5e92-4fcf-840f-7b70bc92b0c1"),
                    TemplateId = templateId,
                    Name = "Lat Pulldown (Vertical Pull)",
                    Category = "Back",
                    MetricLabel1 = "Weight (kg)",
                    MetricLabel2 = "Reps",
                    SortOrder = 5
                },
                new WorkoutExercise
                {
                    Id = Guid.Parse("2269a9ff-05de-4d57-b08e-7e9bfa3d88b4"),
                    TemplateId = templateId,
                    Name = "Cable Rows (Horizontal Pull)",
                    Category = "Back",
                    MetricLabel1 = "Weight (kg)",
                    MetricLabel2 = "Reps",
                    SortOrder = 6
                },
                new WorkoutExercise
                {
                    Id = Guid.Parse("785d06d4-8d48-43d9-a78b-d7b3ea0a8e0f"),
                    TemplateId = templateId,
                    Name = "Deadlift",
                    Category = "Back",
                    MetricLabel1 = "Weight (kg)",
                    MetricLabel2 = "Reps",
                    SortOrder = 7
                },
                new WorkoutExercise
                {
                    Id = Guid.Parse("8c3b28b6-9df2-466d-a36c-94116c4f0b2f"),
                    TemplateId = templateId,
                    Name = "Barbell Squats",
                    Category = "Legs",
                    MetricLabel1 = "Weight (kg)",
                    MetricLabel2 = "Reps",
                    SortOrder = 8
                },
                new WorkoutExercise
                {
                    Id = Guid.Parse("f5c0b021-f3b1-4f9e-a8bf-1049969d30fe"),
                    TemplateId = templateId,
                    Name = "Leg Press",
                    Category = "Legs",
                    MetricLabel1 = "Weight (kg)",
                    MetricLabel2 = "Reps",
                    SortOrder = 9
                },
                new WorkoutExercise
                {
                    Id = Guid.Parse("e3d06eb4-3e9a-4ad3-9b88-1c49603099bc"),
                    TemplateId = templateId,
                    Name = "Leg Curls",
                    Category = "Legs",
                    MetricLabel1 = "Weight (kg)",
                    MetricLabel2 = "Reps",
                    SortOrder = 10
                }
            );
        }
    }
}
