using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;
using TaskFlowPro.API.Data;
using TaskFlowPro.API.Models;

namespace TaskFlowPro.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly AppDbContext _context;

        public UsersController(UserManager<AppUser> userManager, AppDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        public class ProfileUpdateDto
        {
            public string? DisplayName { get; set; }
            public int? UsageType { get; set; }
            public string? AvatarUrl { get; set; }
        }

        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] ProfileUpdateDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized();
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            if (dto.DisplayName != null)
            {
                user.DisplayName = dto.DisplayName;
            }

            if (dto.UsageType.HasValue)
            {
                user.UsageType = dto.UsageType.Value;
            }

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            var profile = await _context.UserProfiles.FirstOrDefaultAsync(p => p.UserId == user.Id);
            if (profile == null)
            {
                profile = new UserProfile { UserId = user.Id };
                _context.UserProfiles.Add(profile);
            }

            if (dto.AvatarUrl != null)
            {
                profile.AvatarUrl = dto.AvatarUrl;
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                Id = user.Id,
                Email = user.Email,
                DisplayName = user.DisplayName,
                AvatarUrl = profile.AvatarUrl,
                UsageType = user.UsageType
            });
        }
    }
}
