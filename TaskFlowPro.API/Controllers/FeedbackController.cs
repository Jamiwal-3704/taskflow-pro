using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.RateLimiting;
using TaskFlowPro.API.Data;
using TaskFlowPro.API.DTOs;
using TaskFlowPro.API.Models;

namespace TaskFlowPro.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    [EnableRateLimiting("GeneralApi")]
    public class FeedbackController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FeedbackController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        [EnableRateLimiting("WritePolicy")]
        public async Task<IActionResult> SubmitFeedback([FromBody] FeedbackDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var feedback = new Feedback
            {
                Name = dto.Name,
                Email = dto.Email,
                ContactNumber = dto.ContactNumber,
                Subject = dto.Subject,
                Description = dto.Description,
                SubmittedAt = DateTime.UtcNow
            };

            // Using EF Core parameters automatically prevents SQL Injection!
            _context.Feedbacks.Add(feedback);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Feedback submitted successfully." });
        }
    }
}
