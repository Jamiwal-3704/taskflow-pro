using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;

namespace TaskFlowPro.API.Models
{
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; } = string.Empty;
        public int UsageType { get; set; }  // 0 = Personal, 1 = Business
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public UserProfile? Profile { get; set; }
        public ICollection<TodoList> Lists { get; set; } = new List<TodoList>();
    }
}
