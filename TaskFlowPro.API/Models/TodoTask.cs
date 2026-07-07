using System;
using System.Collections.Generic;

namespace TaskFlowPro.API.Models
{
    public class TodoTask
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid ListId { get; set; }
        public TodoList List { get; set; } = null!;
        public string? AssigneeId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int Status { get; set; } = 0;  // 0 = Pending, 1 = Working, 2 = Complete
        public int Priority { get; set; } = 0; // 0 = None, 1 = Low, 2 = Med, 3 = High, 4 = Critical
        public bool IsImportant { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? WorkStartedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public DateTime? Deadline { get; set; }
        public DateTime? PlannedDate { get; set; }
        public int SortIndex { get; set; } = 0;
        public int? TimePerformanceMinutes { get; set; }
        public ICollection<TodoSubtask> SubTasks { get; set; } = new List<TodoSubtask>();
    }
}
