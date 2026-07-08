using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TaskFlowPro.API.DTOs
{
    public class TaskCreateDto
    {
        [Required(ErrorMessage = "Task title is required.")]
        [StringLength(100, ErrorMessage = "Task title cannot exceed 100 characters.")]
        public string Title { get; set; } = string.Empty;

        [StringLength(2000, ErrorMessage = "Description cannot exceed 2000 characters.")]
        public string? Description { get; set; }

        [Range(0, 4, ErrorMessage = "Priority must be between 0 (None) and 4 (Critical).")]
        public int Priority { get; set; } = 0;

        public DateTime? Deadline { get; set; }
        public DateTime? PlannedDate { get; set; }
        
        [StringLength(7, ErrorMessage = "ColorHex cannot exceed 7 characters.")]
        public string? ColorHex { get; set; }
    }

    public class TaskUpdateDto
    {
        [Required(ErrorMessage = "Task title is required.")]
        [StringLength(100, ErrorMessage = "Task title cannot exceed 100 characters.")]
        public string Title { get; set; } = string.Empty;

        [StringLength(2000, ErrorMessage = "Description cannot exceed 2000 characters.")]
        public string? Description { get; set; }

        [Range(0, 2, ErrorMessage = "Status must be between 0 (Pending) and 2 (Complete).")]
        public int Status { get; set; }

        [Range(0, 4, ErrorMessage = "Priority must be between 0 (None) and 4 (Critical).")]
        public int Priority { get; set; }

        public bool IsImportant { get; set; }
        public DateTime? Deadline { get; set; }
        public DateTime? PlannedDate { get; set; }
        public int SortIndex { get; set; }
        
        [StringLength(7, ErrorMessage = "ColorHex cannot exceed 7 characters.")]
        public string? ColorHex { get; set; }
    }

    public class TaskStatusPatchDto
    {
        [Range(0, 2, ErrorMessage = "Status must be between 0 (Pending) and 2 (Complete).")]
        public int Status { get; set; }
    }

    public class TaskImportancePatchDto
    {
        public bool IsImportant { get; set; }
    }

    public class SubTaskDto
    {
        public Guid Id { get; set; }
        public Guid TaskId { get; set; }
        public string Title { get; set; } = string.Empty;
        public bool IsCompleted { get; set; }
        public int SortOrder { get; set; }
    }

    public class TaskDto
    {
        public Guid Id { get; set; }
        public Guid ListId { get; set; }
        public string? AssigneeId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? ColorHex { get; set; }
        public int Status { get; set; }
        public int Priority { get; set; }
        public bool IsImportant { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? WorkStartedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public DateTime? Deadline { get; set; }
        public DateTime? PlannedDate { get; set; }
        public int SortIndex { get; set; }
        public int? TimePerformanceMinutes { get; set; }
        public ICollection<SubTaskDto> SubTasks { get; set; } = new List<SubTaskDto>();
    }

    public class SubTaskCreateDto
    {
        [Required(ErrorMessage = "Subtask title is required.")]
        [StringLength(100, ErrorMessage = "Subtask title cannot exceed 100 characters.")]
        public string Title { get; set; } = string.Empty;
    }

    public class SubTaskUpdateDto
    {
        [Required(ErrorMessage = "Subtask title is required.")]
        [StringLength(100, ErrorMessage = "Subtask title cannot exceed 100 characters.")]
        public string Title { get; set; } = string.Empty;

        public bool IsCompleted { get; set; }
        public int SortOrder { get; set; }
    }
}
