using System;
using System.Collections.Generic;

namespace TaskFlowPro.API.Models
{
    public class WorkoutLoggedExercise
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid SessionId { get; set; }
        public WorkoutSession Session { get; set; } = null!;
        public Guid ExerciseId { get; set; }
        public WorkoutExercise Exercise { get; set; } = null!;
        public int SortOrder { get; set; } = 0;
        public ICollection<WorkoutSetLog> SetLogs { get; set; } = new List<WorkoutSetLog>();
    }
}
