using System;
using System.Collections.Generic;

namespace TaskFlowPro.API.Models
{
    public class TodoList
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string OwnerId { get; set; } = string.Empty;
        public AppUser Owner { get; set; } = null!;
        public string Name { get; set; } = string.Empty;
        public string? ColorHex { get; set; }
        public string? Icon { get; set; }
        public int ListType { get; set; } = 0; // 0 = Todo, 1 = Tracker
        public Guid? WorkoutTemplateId { get; set; }
        public WorkoutTemplate? WorkoutTemplate { get; set; }
        public bool IsCollaborative { get; set; } = false;
        public bool IsDefault { get; set; } = false;
        public int SortOrder { get; set; } = 0;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<TodoTask> Tasks { get; set; } = new List<TodoTask>();
        public ICollection<WorkoutSession> WorkoutSessions { get; set; } = new List<WorkoutSession>();
    }
}
