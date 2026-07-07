using System;

namespace TaskFlowPro.API.Models
{
    public class UserProfile
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string UserId { get; set; } = string.Empty;
        public AppUser User { get; set; } = null!;
        public string? AvatarUrl { get; set; }
        public string? GoogleCalendarToken { get; set; }
        public string? OutlookCalendarToken { get; set; }
        public bool IsGoogleConnected { get; set; } = false;
        public bool IsOutlookConnected { get; set; } = false;
    }
}
