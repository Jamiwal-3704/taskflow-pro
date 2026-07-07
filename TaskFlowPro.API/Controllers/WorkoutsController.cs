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
    public class WorkoutsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public WorkoutsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("templates")]
        public async Task<IActionResult> GetTemplates()
        {
            var templates = await _context.WorkoutTemplates
                .OrderBy(t => t.Name)
                .Select(t => new WorkoutTemplateDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    Icon = t.Icon,
                    Description = t.Description
                })
                .ToListAsync();

            return Ok(templates);
        }

        [HttpGet("templates/{templateId}/exercises")]
        public async Task<IActionResult> GetTemplateExercises(Guid templateId)
        {
            var exercises = await _context.WorkoutExercises
                .Where(e => e.TemplateId == templateId)
                .OrderBy(e => e.SortOrder)
                .Select(e => new WorkoutExerciseDto
                {
                    Id = e.Id,
                    TemplateId = e.TemplateId,
                    Category = e.Category,
                    Name = e.Name,
                    Description = e.Description,
                    MetricLabel1 = e.MetricLabel1,
                    MetricLabel2 = e.MetricLabel2
                })
                .ToListAsync();

            return Ok(exercises);
        }

        [HttpGet("sessions")]
        public async Task<IActionResult> GetSession([FromQuery] Guid listId, [FromQuery] string date)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            if (!DateTime.TryParse(date, out var parsedDate))
            {
                return BadRequest("Invalid date format.");
            }

            var targetDate = parsedDate.Date;

            // Verify list ownership
            var listExists = await _context.TodoLists.AnyAsync(l => l.Id == listId && l.OwnerId == userId);
            if (!listExists)
            {
                return NotFound("Workspace list not found.");
            }

            // Find or create session for that day
            var session = await _context.WorkoutSessions
                .Include(s => s.LoggedExercises)
                .ThenInclude(e => e.Exercise)
                .Include(s => s.LoggedExercises)
                .ThenInclude(e => e.SetLogs)
                .FirstOrDefaultAsync(s => s.ListId == listId && s.Date == targetDate);

            if (session == null)
            {
                // Create a blank session automatically
                session = new WorkoutSession
                {
                    ListId = listId,
                    Date = targetDate,
                    TotalVolume = 0,
                    Notes = string.Empty
                };
                _context.WorkoutSessions.Add(session);
                await _context.SaveChangesAsync();
            }

            var dto = new WorkoutSessionDto
            {
                Id = session.Id,
                ListId = session.ListId,
                Date = session.Date,
                Notes = session.Notes,
                TotalVolume = session.TotalVolume,
                LoggedExercises = session.LoggedExercises.OrderBy(le => le.SortOrder).Select(le => new WorkoutLoggedExerciseDto
                {
                    Id = le.Id,
                    SessionId = le.SessionId,
                    ExerciseId = le.ExerciseId,
                    Name = le.Exercise.Name,
                    Category = le.Exercise.Category,
                    MetricLabel1 = le.Exercise.MetricLabel1,
                    MetricLabel2 = le.Exercise.MetricLabel2,
                    SortOrder = le.SortOrder,
                    SetLogs = le.SetLogs.OrderBy(sl => sl.SetIndex).Select(sl => new WorkoutSetLogDto
                    {
                        Id = sl.Id,
                        LoggedExerciseId = sl.LoggedExerciseId,
                        SetIndex = sl.SetIndex,
                        Weight = sl.Weight,
                        Reps = sl.Reps,
                        IsCompleted = sl.IsCompleted
                    }).ToList()
                }).ToList()
            };

            return Ok(dto);
        }

        [HttpPost("sessions")]
        public async Task<IActionResult> CreateSession([FromBody] WorkoutSessionCreateDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var listExists = await _context.TodoLists.AnyAsync(l => l.Id == dto.ListId && l.OwnerId == userId);
            if (!listExists)
            {
                return NotFound("Workspace list not found.");
            }

            var targetDate = dto.Date.Date;
            var session = await _context.WorkoutSessions.FirstOrDefaultAsync(s => s.ListId == dto.ListId && s.Date == targetDate);
            if (session != null)
            {
                return BadRequest("A session already exists for this date.");
            }

            session = new WorkoutSession
            {
                ListId = dto.ListId,
                Date = targetDate,
                Notes = dto.Notes
            };

            _context.WorkoutSessions.Add(session);
            await _context.SaveChangesAsync();

            return Ok(new WorkoutSessionDto
            {
                Id = session.Id,
                ListId = session.ListId,
                Date = session.Date,
                Notes = session.Notes
            });
        }

        [HttpPost("sessions/{sessionId}/exercises")]
        public async Task<IActionResult> AddExerciseToSession(Guid sessionId, [FromBody] WorkoutLoggedExerciseCreateDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var session = await _context.WorkoutSessions
                .Include(s => s.List)
                .FirstOrDefaultAsync(s => s.Id == sessionId && s.List.OwnerId == userId);

            if (session == null)
            {
                return NotFound("Workout session not found.");
            }

            var exerciseExists = await _context.WorkoutExercises.AnyAsync(e => e.Id == dto.ExerciseId);
            if (!exerciseExists)
            {
                return BadRequest("Invalid Exercise ID.");
            }

            var maxSort = await _context.WorkoutLoggedExercises
                .Where(le => le.SessionId == sessionId)
                .MaxAsync(le => (int?)le.SortOrder) ?? 0;

            var loggedExercise = new WorkoutLoggedExercise
            {
                SessionId = sessionId,
                ExerciseId = dto.ExerciseId,
                SortOrder = maxSort + 1
            };

            _context.WorkoutLoggedExercises.Add(loggedExercise);
            await _context.SaveChangesAsync();

            // Reload to get exercise details
            var loaded = await _context.WorkoutLoggedExercises
                .Include(le => le.Exercise)
                .FirstAsync(le => le.Id == loggedExercise.Id);

            return Ok(new WorkoutLoggedExerciseDto
            {
                Id = loaded.Id,
                SessionId = loaded.SessionId,
                ExerciseId = loaded.ExerciseId,
                Name = loaded.Exercise.Name,
                Category = loaded.Exercise.Category,
                MetricLabel1 = loaded.Exercise.MetricLabel1,
                MetricLabel2 = loaded.Exercise.MetricLabel2,
                SortOrder = loaded.SortOrder
            });
        }

        [HttpDelete("sessions/exercises/{id}")]
        public async Task<IActionResult> RemoveExerciseFromSession(Guid id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var loggedExercise = await _context.WorkoutLoggedExercises
                .Include(le => le.Session)
                .ThenInclude(s => s.List)
                .FirstOrDefaultAsync(le => le.Id == id && le.Session.List.OwnerId == userId);

            if (loggedExercise == null)
            {
                return NotFound("Logged exercise not found.");
            }

            _context.WorkoutLoggedExercises.Remove(loggedExercise);
            await _context.SaveChangesAsync();

            // Re-calculate session total volume
            await RecalculateSessionVolume(loggedExercise.SessionId);

            return NoContent();
        }

        [HttpPost("exercises/{loggedExerciseId}/logs")]
        public async Task<IActionResult> AddSetLog(Guid loggedExerciseId, [FromBody] WorkoutSetLogCreateDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var loggedExercise = await _context.WorkoutLoggedExercises
                .Include(le => le.Session)
                .ThenInclude(s => s.List)
                .FirstOrDefaultAsync(le => le.Id == loggedExerciseId && le.Session.List.OwnerId == userId);

            if (loggedExercise == null)
            {
                return NotFound("Logged exercise not found.");
            }

            var log = new WorkoutSetLog
            {
                LoggedExerciseId = loggedExerciseId,
                SetIndex = dto.SetIndex,
                Weight = dto.Weight,
                Reps = dto.Reps,
                IsCompleted = false
            };

            _context.WorkoutSetLogs.Add(log);
            await _context.SaveChangesAsync();

            // Re-calculate session total volume
            await RecalculateSessionVolume(loggedExercise.SessionId);

            return Ok(new WorkoutSetLogDto
            {
                Id = log.Id,
                LoggedExerciseId = log.LoggedExerciseId,
                SetIndex = log.SetIndex,
                Weight = log.Weight,
                Reps = log.Reps,
                IsCompleted = log.IsCompleted
            });
        }

        [HttpPut("logs/{id}")]
        public async Task<IActionResult> UpdateSetLog(Guid id, [FromBody] WorkoutSetLogUpdateDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var log = await _context.WorkoutSetLogs
                .Include(l => l.LoggedExercise)
                .ThenInclude(le => le.Session)
                .ThenInclude(s => s.List)
                .FirstOrDefaultAsync(l => l.Id == id && l.LoggedExercise.Session.List.OwnerId == userId);

            if (log == null)
            {
                return NotFound("Logged set not found.");
            }

            log.Weight = dto.Weight;
            log.Reps = dto.Reps;
            log.IsCompleted = dto.IsCompleted;

            await _context.SaveChangesAsync();

            // Re-calculate session total volume
            await RecalculateSessionVolume(log.LoggedExercise.SessionId);

            return Ok(new WorkoutSetLogDto
            {
                Id = log.Id,
                LoggedExerciseId = log.LoggedExerciseId,
                SetIndex = log.SetIndex,
                Weight = log.Weight,
                Reps = log.Reps,
                IsCompleted = log.IsCompleted
            });
        }

        [HttpDelete("logs/{id}")]
        public async Task<IActionResult> DeleteSetLog(Guid id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var log = await _context.WorkoutSetLogs
                .Include(l => l.LoggedExercise)
                .ThenInclude(le => le.Session)
                .ThenInclude(s => s.List)
                .FirstOrDefaultAsync(l => l.Id == id && l.LoggedExercise.Session.List.OwnerId == userId);

            if (log == null)
            {
                return NotFound("Logged set not found.");
            }

            var sessionId = log.LoggedExercise.SessionId;

            _context.WorkoutSetLogs.Remove(log);
            await _context.SaveChangesAsync();

            // Re-calculate session total volume
            await RecalculateSessionVolume(sessionId);

            return NoContent();
        }

        private async Task RecalculateSessionVolume(Guid sessionId)
        {
            var session = await _context.WorkoutSessions
                .Include(s => s.LoggedExercises)
                .ThenInclude(e => e.SetLogs)
                .FirstOrDefaultAsync(s => s.Id == sessionId);

            if (session != null)
            {
                // Calculate Total Volume: Sum of (Weight * Reps) for all completed sets
                double total = 0;
                foreach (var exercise in session.LoggedExercises)
                {
                    total += exercise.SetLogs
                        .Where(l => l.IsCompleted)
                        .Sum(l => l.Weight * l.Reps);
                }
                session.TotalVolume = total;
                await _context.SaveChangesAsync();
            }
        }
    }
}
