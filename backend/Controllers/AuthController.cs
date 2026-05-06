using FoodDeliveryAPI.Data;
using FoodDeliveryAPI.DTOs;
using FoodDeliveryAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace FoodDeliveryAPI.Controllers;

[ApiController]
[Route("api")]
public class AuthController(DbService db) : ControllerBase
{
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        try
        {
            var user = await db.QueryFirstOrDefaultAsync<User>(
                "SELECT * FROM users WHERE email = @Email", new { req.Email });

            if (user is null)
                return Unauthorized(new { error = "Email not found, Please Consider Signing Up!" });

            if (!BCrypt.Net.BCrypt.Verify(req.Password, user.Password))
                return Unauthorized(new { error = "Invalid credentials" });

            return Ok(new
            {
                message = "Login successful",
                user = new { id = user.Id, email = user.Email }
            });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Database query error: {ex}");
            return StatusCode(500, new { error = "Server error" });
        }
    }

    [HttpPost("signup")]
    public async Task<IActionResult> Signup([FromBody] SignupRequest req)
    {
        try
        {
            var existing = await db.QueryFirstOrDefaultAsync<User>(
                "SELECT * FROM users WHERE email = @Email", new { req.Email });

            if (existing is not null)
                return BadRequest(new { error = "User already exists" });

            var hashed = BCrypt.Net.BCrypt.HashPassword(req.Password, 10);
            await db.ExecuteAsync(
                "INSERT INTO users (email, password) VALUES (@Email, @Password)",
                new { req.Email, Password = hashed });

            return Ok(new { message = "User registered successfully" });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Database query error: {ex}");
            return StatusCode(500, new { error = "Server error" });
        }
    }

    [HttpGet("get-user/{userId}")]
    public async Task<IActionResult> GetUser(int userId)
    {
        try
        {
            var user = await db.QueryFirstOrDefaultAsync<dynamic>(
                "SELECT address FROM users WHERE id = @UserId", new { UserId = userId });

            if (user is null)
                return NotFound(new { error = "User not found" });

            return Ok(user);
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error fetching user: {ex}");
            return StatusCode(500, new { error = "Internal Server Error" });
        }
    }
}
