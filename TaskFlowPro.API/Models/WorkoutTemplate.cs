using System;
using System.Collections.Generic;

namespace TaskFlowPro.API.Models
{
    public class WorkoutTemplate
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public string? Icon { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<WorkoutExercise> Exercises { get; set; } = new List<WorkoutExercise>();
    }
}
