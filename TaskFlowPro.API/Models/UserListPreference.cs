using System;

namespace TaskFlowPro.API.Models
{
    public class UserListPreference
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string UserId { get; set; } = string.Empty;
        public Guid ListId { get; set; }
        public int ViewType { get; set; } = 0;   // 0 = List, 1 = Board
        public int SortBy { get; set; } = 0;     // 0 = Smart, 1 = Manual, 2 = Name, etc.
        public int GroupBy { get; set; } = 0;    // 0 = None, 1 = Priority, etc.
        public string? FilterJson { get; set; }  // Serialized filter criteria
    }
}
