using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using TaskFlowPro.API.Data;
using TaskFlowPro.API.DTOs;
using TaskFlowPro.API.Models;

namespace TaskFlowPro.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api")]
    public class TasksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TasksController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("lists/{listId}/tasks")]
        public async Task<IActionResult> GetTasks(Guid listId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            // Verify list ownership
            var listExists = await _context.TodoLists.AnyAsync(l => l.Id == listId && l.OwnerId == userId);
            if (!listExists)
            {
                return NotFound("List not found or you are not the owner.");
            }

            var tasks = await _context.TodoTasks
                .Where(t => t.ListId == listId)
                .OrderBy(t => t.SortIndex)
                .Select(t => new TaskDto
                {
                    Id = t.Id,
                    ListId = t.ListId,
                    AssigneeId = t.AssigneeId,
                    Title = t.Title,
                    Description = t.Description,
                    Status = t.Status,
                    Priority = t.Priority,
                    IsImportant = t.IsImportant,
                    CreatedAt = t.CreatedAt,
                    WorkStartedAt = t.WorkStartedAt,
                    CompletedAt = t.CompletedAt,
                    Deadline = t.Deadline,
                    PlannedDate = t.PlannedDate,
                    SortIndex = t.SortIndex,
                    TimePerformanceMinutes = t.TimePerformanceMinutes,
                    SubTasks = t.SubTasks.OrderBy(s => s.SortOrder).Select(s => new SubTaskDto
                    {
                        Id = s.Id,
                        TaskId = s.TaskId,
                        Title = s.Title,
                        IsCompleted = s.IsCompleted,
                        SortOrder = s.SortOrder
                    }).ToList()
                })
                .ToListAsync();

            return Ok(tasks);
        }

        [HttpPost("lists/{listId}/tasks")]
        public async Task<IActionResult> CreateTask(Guid listId, [FromBody] TaskCreateDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            var listExists = await _context.TodoLists.AnyAsync(l => l.Id == listId && l.OwnerId == userId);
            if (!listExists)
            {
                return NotFound("List not found or you are not the owner.");
            }

            var maxSortIndex = await _context.TodoTasks
                .Where(t => t.ListId == listId)
                .MaxAsync(t => (int?)t.SortIndex) ?? 0;

            var task = new TodoTask
            {
                ListId = listId,
                Title = dto.Title,
                Description = dto.Description,
                Priority = dto.Priority,
                Status = 0, // 0 = Pending
                CreatedAt = DateTime.UtcNow,
                Deadline = dto.Deadline,
                PlannedDate = dto.PlannedDate,
                SortIndex = maxSortIndex + 1
            };

            _context.TodoTasks.Add(task);
            await _context.SaveChangesAsync();

            var taskDto = new TaskDto
            {
                Id = task.Id,
                ListId = task.ListId,
                Title = task.Title,
                Description = task.Description,
                Status = task.Status,
                Priority = task.Priority,
                IsImportant = task.IsImportant,
                CreatedAt = task.CreatedAt,
                Deadline = task.Deadline,
                PlannedDate = task.PlannedDate,
                SortIndex = task.SortIndex
            };

            return CreatedAtAction(nameof(GetTasks), new { listId = listId }, taskDto);
        }

        [HttpPut("tasks/{id}")]
        public async Task<IActionResult> UpdateTask(Guid id, [FromBody] TaskUpdateDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            var task = await _context.TodoTasks
                .Include(t => t.List)
                .FirstOrDefaultAsync(t => t.Id == id && t.List.OwnerId == userId);

            if (task == null)
            {
                return NotFound("Task not found or you do not have permission.");
            }

            task.Title = dto.Title;
            task.Description = dto.Description;
            task.Priority = dto.Priority;
            task.Status = dto.Status;
            task.IsImportant = dto.IsImportant;
            task.Deadline = dto.Deadline;
            task.PlannedDate = dto.PlannedDate;
            task.SortIndex = dto.SortIndex;

            await _context.SaveChangesAsync();

            return Ok(new TaskDto
            {
                Id = task.Id,
                ListId = task.ListId,
                Title = task.Title,
                Description = task.Description,
                Status = task.Status,
                Priority = task.Priority,
                IsImportant = task.IsImportant,
                CreatedAt = task.CreatedAt,
                WorkStartedAt = task.WorkStartedAt,
                CompletedAt = task.CompletedAt,
                Deadline = task.Deadline,
                PlannedDate = task.PlannedDate,
                SortIndex = task.SortIndex,
                TimePerformanceMinutes = task.TimePerformanceMinutes
            });
        }

        [HttpPatch("tasks/{id}/status")]
        public async Task<IActionResult> PatchStatus(Guid id, [FromBody] TaskStatusPatchDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            var task = await _context.TodoTasks
                .Include(t => t.List)
                .FirstOrDefaultAsync(t => t.Id == id && t.List.OwnerId == userId);

            if (task == null)
            {
                return NotFound("Task not found or you do not have permission.");
            }

            var previousStatus = task.Status;
            var newStatus = dto.Status;

            if (newStatus == 1 && previousStatus == 0) // Pending -> Working
            {
                task.WorkStartedAt = DateTime.UtcNow;
            }
            else if (newStatus == 2) // Any -> Complete
            {
                task.CompletedAt = DateTime.UtcNow;
                if (task.Deadline.HasValue)
                {
                    var diff = (int)(task.Deadline.Value - task.CompletedAt.Value).TotalMinutes;
                    task.TimePerformanceMinutes = diff;
                }
            }

            task.Status = newStatus;
            await _context.SaveChangesAsync();

            return Ok(new TaskDto
            {
                Id = task.Id,
                ListId = task.ListId,
                Title = task.Title,
                Status = task.Status,
                WorkStartedAt = task.WorkStartedAt,
                CompletedAt = task.CompletedAt,
                Deadline = task.Deadline,
                TimePerformanceMinutes = task.TimePerformanceMinutes
            });
        }

        [HttpPatch("tasks/{id}/important")]
        public async Task<IActionResult> PatchImportant(Guid id, [FromBody] TaskImportancePatchDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            var task = await _context.TodoTasks
                .Include(t => t.List)
                .FirstOrDefaultAsync(t => t.Id == id && t.List.OwnerId == userId);

            if (task == null)
            {
                return NotFound("Task not found or you do not have permission.");
            }

            task.IsImportant = dto.IsImportant;
            await _context.SaveChangesAsync();

            return Ok(new TaskDto
            {
                Id = task.Id,
                ListId = task.ListId,
                Title = task.Title,
                IsImportant = task.IsImportant
            });
        }

        [HttpDelete("tasks/{id}")]
        public async Task<IActionResult> DeleteTask(Guid id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var task = await _context.TodoTasks
                .Include(t => t.List)
                .FirstOrDefaultAsync(t => t.Id == id && t.List.OwnerId == userId);

            if (task == null)
            {
                return NotFound("Task not found or you do not have permission.");
            }

            _context.TodoTasks.Remove(task);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("tasks/important")]
        public async Task<IActionResult> GetImportantTasks()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var tasks = await _context.TodoTasks
                .Include(t => t.List)
                .Where(t => t.List.OwnerId == userId && t.IsImportant)
                .OrderByDescending(t => t.CreatedAt)
                .Select(t => new TaskDto
                {
                    Id = t.Id,
                    ListId = t.ListId,
                    AssigneeId = t.AssigneeId,
                    Title = t.Title,
                    Description = t.Description,
                    Status = t.Status,
                    Priority = t.Priority,
                    IsImportant = t.IsImportant,
                    CreatedAt = t.CreatedAt,
                    WorkStartedAt = t.WorkStartedAt,
                    CompletedAt = t.CompletedAt,
                    Deadline = t.Deadline,
                    PlannedDate = t.PlannedDate,
                    SortIndex = t.SortIndex,
                    TimePerformanceMinutes = t.TimePerformanceMinutes
                })
                .ToListAsync();

            return Ok(tasks);
        }

        [HttpGet("tasks/search")]
        public async Task<IActionResult> SearchTasks([FromQuery] string q)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var query = _context.TodoTasks
                .Include(t => t.List)
                .Where(t => t.List.OwnerId == userId);

            if (!string.IsNullOrWhiteSpace(q))
            {
                var lowerQ = q.ToLower();
                query = query.Where(t => t.Title.ToLower().Contains(lowerQ) || (t.Description != null && t.Description.ToLower().Contains(lowerQ)));
            }

            var tasks = await query
                .OrderByDescending(t => t.CreatedAt)
                .Take(15)
                .Select(t => new TaskDto
                {
                    Id = t.Id,
                    ListId = t.ListId,
                    AssigneeId = t.AssigneeId,
                    Title = t.Title,
                    Description = t.Description,
                    Status = t.Status,
                    Priority = t.Priority,
                    IsImportant = t.IsImportant,
                    CreatedAt = t.CreatedAt,
                    WorkStartedAt = t.WorkStartedAt,
                    CompletedAt = t.CompletedAt,
                    Deadline = t.Deadline,
                    PlannedDate = t.PlannedDate,
                    SortIndex = t.SortIndex,
                    TimePerformanceMinutes = t.TimePerformanceMinutes
                })
                .ToListAsync();

            return Ok(tasks);
        }
    }
}
