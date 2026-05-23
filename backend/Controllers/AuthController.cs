using Microsoft.AspNetCore.Mvc;
using backend.DTOs.Auth;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _auth;
    public AuthController(IAuthService auth) => _auth = auth;

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var result = await _auth.RegisterAsync(request);
        if (result is null) return Conflict(new { error = "Email already in use" });
        return CreatedAtAction(nameof(Register), result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var result = await _auth.LoginAsync(request);
        if (result is null) return Unauthorized(new { error = "Invalid email or password" });
        return Ok(result);
    }
}