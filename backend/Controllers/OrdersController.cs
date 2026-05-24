using FoodDeliveryAPI.Data;
using FoodDeliveryAPI.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace FoodDeliveryAPI.Controllers;

[ApiController]
public class OrdersController(DbService db) : ControllerBase
{
    [HttpPost("api/orders")]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest req)
    {
        if (req.UserId == 0 || req.TotalPrice == 0 ||
            string.IsNullOrEmpty(req.PaymentInfo) || string.IsNullOrEmpty(req.Items))
        {
            Console.Error.WriteLine($"❌ Missing required fields: {req}");
            return BadRequest(new { message = "Missing required fields" });
        }

        try
        {
            await db.ExecuteAsync(
                "INSERT INTO Orders (user_id, total_price, payment_info, items) VALUES (@UserId, @TotalPrice, @PaymentInfo, @Items)",
                new { req.UserId, req.TotalPrice, req.PaymentInfo, req.Items });

            return StatusCode(201, new { message = "Order placed successfully" });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"❌ Database query error: {ex}");
            return StatusCode(500, new { message = "Server error", error = ex.Message });
        }
    }

    [HttpPost("place-order")]
    public async Task<IActionResult> PlaceOrder([FromBody] PlaceOrderRequest req)
    {
        if (string.IsNullOrEmpty(req.Name) || string.IsNullOrEmpty(req.PhoneNumber) ||
            string.IsNullOrEmpty(req.Email) || string.IsNullOrEmpty(req.Address))
        {
            return BadRequest(new { error = "Missing required fields." });
        }

        try
        {
            var users = await db.QueryAsync<dynamic>(
                "SELECT * FROM users WHERE email = @Email", new { req.Email });

            if (!users.Any())
                return NotFound(new { error = "Email Not Found, Please Sign Up!" });

            await db.ExecuteAsync(
                "UPDATE users SET name = @Name, phoneNumber = @PhoneNumber, address = @Address WHERE email = @Email",
                new { req.Name, req.PhoneNumber, req.Address, req.Email });

            return Ok(new { message = "User details updated successfully." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Database error", details = ex.Message });
        }
    }
}
