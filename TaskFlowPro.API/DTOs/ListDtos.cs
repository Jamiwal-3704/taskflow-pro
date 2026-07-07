using System;
using System.ComponentModel.DataAnnotations;

namespace TaskFlowPro.API.DTOs
{
    public class ListCreateDto
    {
        [Required(ErrorMessage = "List name is required.")]
        [StringLength(50, ErrorMessage = "List name cannot exceed 50 characters.")]
        public string Name { get; set; } = string.Empty;

        [StringLength(7, ErrorMessage = "Color Hex must be a valid hex code (e.g. #FFFFFF).")]
        [RegularExpression(@"^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$", ErrorMessage = "Invalid hex color format.")]
        public string? ColorHex { get; set; }

        [StringLength(50, ErrorMessage = "Icon identifier cannot exceed 50 characters.")]
        public string? Icon { get; set; }

        [Range(0, 1, ErrorMessage = "List type must be either 0 (Todo) or 1 (Tracker).")]
        public int ListType { get; set; } = 0; // 0 = Todo, 1 = Tracker

        public Guid? WorkoutTemplateId { get; set; }

        public bool IsCollaborative { get; set; } = false;
    }

    public class ListUpdateDto
    {
        [Required(ErrorMessage = "List name is required.")]
        [StringLength(50, ErrorMessage = "List name cannot exceed 50 characters.")]
        public string Name { get; set; } = string.Empty;

        [StringLength(7, ErrorMessage = "Color Hex must be a valid hex code (e.g. #FFFFFF).")]
        [RegularExpression(@"^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$", ErrorMessage = "Invalid hex color format.")]
        public string? ColorHex { get; set; }

        [StringLength(50, ErrorMessage = "Icon identifier cannot exceed 50 characters.")]
        public string? Icon { get; set; }

        public bool IsCollaborative { get; set; }
    }

    public class ListDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? ColorHex { get; set; }
        public string? Icon { get; set; }
        public int ListType { get; set; }
        public Guid? WorkoutTemplateId { get; set; }
        public bool IsCollaborative { get; set; }
        public bool IsDefault { get; set; }
        public int SortOrder { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class ListReorderDto
    {
        public Guid Id { get; set; }
        public int SortOrder { get; set; }
    }
}
