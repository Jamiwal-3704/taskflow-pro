using System;

namespace TaskFlowPro.API.Models
{
    public class TodoSubtask
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid TaskId { get; set; }
        public TodoTask Task { get; set; } = null!;
        public string Title { get; set; } = string.Empty;
        public bool IsCompleted { get; set; } = false;
        public int SortOrder { get; set; } = 0;
    }
}
