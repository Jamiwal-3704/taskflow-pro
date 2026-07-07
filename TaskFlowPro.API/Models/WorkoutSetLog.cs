using System;

namespace TaskFlowPro.API.Models
{
    public class WorkoutSetLog
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid LoggedExerciseId { get; set; }
        public WorkoutLoggedExercise LoggedExercise { get; set; } = null!;
        public int SetIndex { get; set; } // Set number: 1, 2, 3
        public double Weight { get; set; } // e.g. Weight (kg)
        public double Reps { get; set; } // e.g. Reps count
        public bool IsCompleted { get; set; } = false;
    }
}
