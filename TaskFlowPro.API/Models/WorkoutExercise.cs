using System;

namespace TaskFlowPro.API.Models
{
    public class WorkoutExercise
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid TemplateId { get; set; }
        public WorkoutTemplate Template { get; set; } = null!;
        public string Category { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string MetricLabel1 { get; set; } = "Weight (kg)";
        public string MetricLabel2 { get; set; } = "Reps";
        public int SortOrder { get; set; } = 0;
    }
}
