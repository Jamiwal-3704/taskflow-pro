using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;
using TaskFlowPro.API.Data;
using TaskFlowPro.API.Models;

var builder = WebApplication.CreateBuilder(args);

// Bind to PORT env variable for Render deployment
var port = Environment.GetEnvironmentVariable("PORT") ?? "5100";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// 1. Database Connection (PostgreSQL / NeonDB)
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

// 2. Identity Service configuration
builder.Services.AddIdentity<AppUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

// 3. JWT Authentication Setup
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(opt =>
{
    opt.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
    };
});

// 4. SignalR Real-time communication
builder.Services.AddSignalR();

// 5. CORS policy for React Frontend Client
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>()
    ?? new[] { "http://localhost:5173" };

builder.Services.AddCors(opt => opt.AddPolicy("ReactApp", p =>
    p.WithOrigins(allowedOrigins)
     .AllowAnyHeader()
     .AllowAnyMethod()
     .AllowCredentials()));

builder.Services.AddControllers();
builder.Services.AddOpenApi();

// 6. Rate Limiting Setup (DDoS Mitigation Layer 2)
builder.Services.AddRateLimiter(options =>
{
    // Return 429 Too Many Requests when limit exceeded
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    // POLICY 1 — General API (100 requests per minute per IP)
    options.AddSlidingWindowLimiter("GeneralApi", config =>
    {
        config.PermitLimit = 100;
        config.Window = TimeSpan.FromMinutes(1);
        config.SegmentsPerWindow = 6; // checks every 10 seconds
        config.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        config.QueueLimit = 5;
    });

    // POLICY 2 — Auth endpoints (stricter — 5 attempts per minute)
    // Prevents brute force login attacks
    options.AddFixedWindowLimiter("AuthPolicy", config =>
    {
        config.PermitLimit = 5;
        config.Window = TimeSpan.FromMinutes(1);
        config.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        config.QueueLimit = 0; // no queuing — reject immediately
    });

    // POLICY 3 — Task creation (20 tasks per minute per user)
    options.AddFixedWindowLimiter("WritePolicy", config =>
    {
        config.PermitLimit = 20;
        config.Window = TimeSpan.FromMinutes(1);
        config.QueueLimit = 2;
    });

    // Custom rejection response — tells client when to retry
    options.OnRejected = async (context, cancellationToken) =>
    {
        context.HttpContext.Response.StatusCode = 429;
        context.HttpContext.Response.Headers["Retry-After"] = "60";
        await context.HttpContext.Response.WriteAsJsonAsync(new
        {
            error = "Too many requests",
            message = "You have exceeded the rate limit. Please wait 60 seconds.",
            retryAfter = 60
        }, cancellationToken);
    };
});

var app = builder.Build();

// Configure request pipelines
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("ReactApp");

app.UseAuthentication();
app.UseAuthorization();
app.UseRateLimiter(); // ← ADD THIS LINE HERE

app.MapControllers();

// SignalR Hub will be mapped in Phase 4 when CollaborationHub is built:
// app.MapHub<CollaborationHub>("/hubs/collab");

app.Run();
