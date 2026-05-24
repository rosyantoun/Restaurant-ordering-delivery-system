using FoodDeliveryAPI.Data;
using FoodDeliveryAPI.DTOs;
using FoodDeliveryAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace FoodDeliveryAPI.Controllers;

[ApiController]
[Route("api/feedback")]
public class FeedbackController(DbService db) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> SubmitFeedback([FromBody] FeedbackRequest req)
    {
        if (string.IsNullOrEmpty(req.Name) || req.Rating == 0 || string.IsNullOrEmpty(req.Comment))
            return BadRequest(new { message = "⚠️ Name, rating, and comment are required" });

        try
        {
            await db.ExecuteAsync(
                "INSERT INTO feedback (name, rating, comment, imagePath) VALUES (@Name, @Rating, @Comment, @ImagePath)",
                new { req.Name, req.Rating, req.Comment, req.ImagePath });

            return StatusCode(201, new { message = "✅ Feedback submitted successfully!" });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"❌ Error inserting feedback: {ex}");
            return StatusCode(500, new { message = "Server error" });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetFeedback()
    {
        try
        {
            var feedback = await db.QueryAsync<Feedback>("SELECT * FROM feedback");
            return Ok(feedback);
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"❌ Error fetching feedback: {ex}");
            return StatusCode(500, new { message = "Server error" });
        }
    }
}
