using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.RateLimiting;
using TaskFlowPro.API.Data;
using TaskFlowPro.API.DTOs;
using TaskFlowPro.API.Models;

namespace TaskFlowPro.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api")]
    [EnableRateLimiting("GeneralApi")]
    public class SubTasksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SubTasksController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("tasks/{taskId}/subtasks")]
        [EnableRateLimiting("WritePolicy")]
        public async Task<IActionResult> CreateSubTask(Guid taskId, [FromBody] SubTaskCreateDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            var task = await _context.TodoTasks
                .Include(t => t.List)
                .FirstOrDefaultAsync(t => t.Id == taskId && t.List.OwnerId == userId);

            if (task == null)
            {
                return NotFound("Task not found or you do not have permission.");
            }

            var maxSortOrder = await _context.TodoSubtasks
                .Where(s => s.TaskId == taskId)
                .MaxAsync(s => (int?)s.SortOrder) ?? 0;

            var subTask = new TodoSubtask
            {
                TaskId = taskId,
                Title = dto.Title,
                IsCompleted = false,
                SortOrder = maxSortOrder + 1
            };

            _context.TodoSubtasks.Add(subTask);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(CreateSubTask), new { id = subTask.Id }, new SubTaskDto
            {
                Id = subTask.Id,
                TaskId = subTask.TaskId,
                Title = subTask.Title,
                IsCompleted = subTask.IsCompleted,
                SortOrder = subTask.SortOrder
            });
        }

        [HttpPut("subtasks/{id}")]
        [EnableRateLimiting("WritePolicy")]
        public async Task<IActionResult> UpdateSubTask(Guid id, [FromBody] SubTaskUpdateDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            var subTask = await _context.TodoSubtasks
                .Include(s => s.Task)
                .ThenInclude(t => t.List)
                .FirstOrDefaultAsync(s => s.Id == id && s.Task.List.OwnerId == userId);

            if (subTask == null)
            {
                return NotFound("Subtask not found or you do not have permission.");
            }

            subTask.Title = dto.Title;
            subTask.IsCompleted = dto.IsCompleted;
            subTask.SortOrder = dto.SortOrder;

            await _context.SaveChangesAsync();

            return Ok(new SubTaskDto
            {
                Id = subTask.Id,
                TaskId = subTask.TaskId,
                Title = subTask.Title,
                IsCompleted = subTask.IsCompleted,
                SortOrder = subTask.SortOrder
            });
        }

        [HttpDelete("subtasks/{id}")]
        [EnableRateLimiting("WritePolicy")]
        public async Task<IActionResult> DeleteSubTask(Guid id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var subTask = await _context.TodoSubtasks
                .Include(s => s.Task)
                .ThenInclude(t => t.List)
                .FirstOrDefaultAsync(s => s.Id == id && s.Task.List.OwnerId == userId);

            if (subTask == null)
            {
                return NotFound("Subtask not found or you do not have permission.");
            }

            _context.TodoSubtasks.Remove(subTask);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
