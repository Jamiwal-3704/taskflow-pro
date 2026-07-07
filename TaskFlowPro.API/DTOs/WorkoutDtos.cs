using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TaskFlowPro.API.DTOs
{
    public class WorkoutTemplateDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Icon { get; set; }
        public string? Description { get; set; }
        public ICollection<WorkoutExerciseDto> Exercises { get; set; } = new List<WorkoutExerciseDto>();
    }

    public class WorkoutExerciseDto
    {
        public Guid Id { get; set; }
        public Guid TemplateId { get; set; }
        public string Category { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string MetricLabel1 { get; set; } = "Weight (kg)";
        public string MetricLabel2 { get; set; } = "Reps";
    }

    public class WorkoutSetLogDto
    {
        public Guid Id { get; set; }
        public Guid LoggedExerciseId { get; set; }
        public int SetIndex { get; set; }
        public double Weight { get; set; }
        public double Reps { get; set; }
        public bool IsCompleted { get; set; }
    }

    public class WorkoutLoggedExerciseDto
    {
        public Guid Id { get; set; }
        public Guid SessionId { get; set; }
        public Guid ExerciseId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string MetricLabel1 { get; set; } = "Weight (kg)";
        public string MetricLabel2 { get; set; } = "Reps";
        public int SortOrder { get; set; }
        public ICollection<WorkoutSetLogDto> SetLogs { get; set; } = new List<WorkoutSetLogDto>();
    }

    public class WorkoutSessionDto
    {
        public Guid Id { get; set; }
        public Guid ListId { get; set; }
        public DateTime Date { get; set; }
        public string? Notes { get; set; }
        public double TotalVolume { get; set; }
        public ICollection<WorkoutLoggedExerciseDto> LoggedExercises { get; set; } = new List<WorkoutLoggedExerciseDto>();
    }

    public class WorkoutSessionCreateDto
    {
        [Required(ErrorMessage = "List ID is required.")]
        public Guid ListId { get; set; }

        [Required(ErrorMessage = "Session date is required.")]
        public DateTime Date { get; set; }

        [StringLength(500, ErrorMessage = "Session notes cannot exceed 500 characters.")]
        public string? Notes { get; set; }
    }

    public class WorkoutLoggedExerciseCreateDto
    {
        [Required(ErrorMessage = "Exercise ID is required.")]
        public Guid ExerciseId { get; set; }
    }

    public class WorkoutSetLogCreateDto
    {
        [Range(1, 100, ErrorMessage = "Set index must be between 1 and 100.")]
        public int SetIndex { get; set; }

        [Range(0, 2000, ErrorMessage = "Weight must be between 0 and 2000 kg.")]
        public double Weight { get; set; }

        [Range(0, 500, ErrorMessage = "Reps must be between 0 and 500.")]
        public double Reps { get; set; }
    }

    public class WorkoutSetLogUpdateDto
    {
        [Range(0, 2000, ErrorMessage = "Weight must be between 0 and 2000 kg.")]
        public double Weight { get; set; }

        [Range(0, 500, ErrorMessage = "Reps must be between 0 and 500.")]
        public double Reps { get; set; }

        public bool IsCompleted { get; set; }
    }
}
