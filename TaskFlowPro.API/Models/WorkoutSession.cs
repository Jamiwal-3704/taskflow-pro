using System;
using System.Collections.Generic;

namespace TaskFlowPro.API.Models
{
    public class WorkoutSession
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid ListId { get; set; }
        public TodoList List { get; set; } = null!;
        public DateTime Date { get; set; } = DateTime.UtcNow.Date;
        public string? Notes { get; set; }
        public double TotalVolume { get; set; } = 0; // Total volume (weight * reps) logged
        public ICollection<WorkoutLoggedExercise> LoggedExercises { get; set; } = new List<WorkoutLoggedExercise>();
    }
}
