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
    [Route("api/[controller]")]
    public class ListsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ListsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetLists()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var lists = await _context.TodoLists
                .Where(l => l.OwnerId == userId)
                .OrderBy(l => l.SortOrder)
                .Select(l => new ListDto
                {
                    Id = l.Id,
                    Name = l.Name,
                    ColorHex = l.ColorHex,
                    Icon = l.Icon,
                    ListType = l.ListType,
                    WorkoutTemplateId = l.WorkoutTemplateId,
                    IsCollaborative = l.IsCollaborative,
                    IsDefault = l.IsDefault,
                    SortOrder = l.SortOrder,
                    CreatedAt = l.CreatedAt
                })
                .ToListAsync();

            return Ok(lists);
        }

        [HttpPost]
        public async Task<IActionResult> CreateList([FromBody] ListCreateDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Get max sort order to append list to bottom
            // Use nullable MaxAsync to avoid EF Core SQL translation issues with DefaultIfEmpty
            var maxSortOrder = await _context.TodoLists
                .Where(l => l.OwnerId == userId)
                .MaxAsync(l => (int?)l.SortOrder) ?? 0;

            var list = new TodoList
            {
                Name = dto.Name,
                OwnerId = userId,
                ColorHex = dto.ColorHex ?? "#3B82F6",
                Icon = dto.Icon ?? "ListTodo",
                ListType = dto.ListType,
                WorkoutTemplateId = dto.WorkoutTemplateId,
                IsCollaborative = dto.IsCollaborative,
                IsDefault = false,
                SortOrder = maxSortOrder + 1,
                CreatedAt = DateTime.UtcNow
            };

            // If template is specified, verify it exists
            if (dto.ListType == 1 && dto.WorkoutTemplateId.HasValue)
            {
                var templateExists = await _context.WorkoutTemplates.AnyAsync(t => t.Id == dto.WorkoutTemplateId.Value);
                if (!templateExists)
                {
                    return BadRequest("Invalid Workout Template ID.");
                }
            }

            _context.TodoLists.Add(list);
            await _context.SaveChangesAsync();

            var listDto = new ListDto
            {
                Id = list.Id,
                Name = list.Name,
                ColorHex = list.ColorHex,
                Icon = list.Icon,
                ListType = list.ListType,
                WorkoutTemplateId = list.WorkoutTemplateId,
                IsCollaborative = list.IsCollaborative,
                IsDefault = list.IsDefault,
                SortOrder = list.SortOrder,
                CreatedAt = list.CreatedAt
            };

            return CreatedAtAction(nameof(GetLists), new { id = list.Id }, listDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateList(Guid id, [FromBody] ListUpdateDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var list = await _context.TodoLists.FirstOrDefaultAsync(l => l.Id == id && l.OwnerId == userId);
            if (list == null)
            {
                return NotFound("List not found or you are not the owner.");
            }

            if (list.IsDefault)
            {
                return BadRequest("The default system list cannot be modified.");
            }

            list.Name = dto.Name;
            list.ColorHex = dto.ColorHex;
            list.Icon = dto.Icon;
            list.IsCollaborative = dto.IsCollaborative;

            await _context.SaveChangesAsync();

            return Ok(new ListDto
            {
                Id = list.Id,
                Name = list.Name,
                ColorHex = list.ColorHex,
                Icon = list.Icon,
                ListType = list.ListType,
                WorkoutTemplateId = list.WorkoutTemplateId,
                IsCollaborative = list.IsCollaborative,
                IsDefault = list.IsDefault,
                SortOrder = list.SortOrder,
                CreatedAt = list.CreatedAt
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteList(Guid id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var list = await _context.TodoLists.FirstOrDefaultAsync(l => l.Id == id && l.OwnerId == userId);
            if (list == null)
            {
                return NotFound("List not found or you are not the owner.");
            }

            if (list.IsDefault)
            {
                return BadRequest("The default system list cannot be deleted.");
            }

            _context.TodoLists.Remove(list);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("reorder")]
        public async Task<IActionResult> ReorderLists([FromBody] ListReorderDto[] dtos)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var listIds = dtos.Select(d => d.Id).ToList();
            var lists = await _context.TodoLists
                .Where(l => listIds.Contains(l.Id) && l.OwnerId == userId)
                .ToListAsync();

            foreach (var listDto in dtos)
            {
                var list = lists.FirstOrDefault(l => l.Id == listDto.Id);
                if (list != null)
                {
                    list.SortOrder = listDto.SortOrder;
                }
            }

            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
