<<<<<<< HEAD
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
=======
﻿using Microsoft.AspNetCore.Mvc;
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
>>>>>>> origin/main
