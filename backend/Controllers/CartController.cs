<<<<<<< HEAD
using FoodDeliveryAPI.Data;
using FoodDeliveryAPI.DTOs;
using FoodDeliveryAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace FoodDeliveryAPI.Controllers;

[ApiController]
[Route("api")]
public class CartController(DbService db) : ControllerBase
{
    [HttpGet("orderitems")]
    public async Task<IActionResult> GetOrderItems([FromQuery] int user_id)
    {
        if (user_id == 0)
            return BadRequest(new { error = "User ID is required" });

        try
        {
            var items = await db.QueryAsync<OrderItem>(
                @"SELECT oi.item_id, oi.user_id, oi.quantity, oi.price, i.name, i.imageURL
                  FROM OrderItems oi
                  JOIN Items i ON oi.item_id = i.id
                  WHERE oi.user_id = @UserId",
                new { UserId = user_id });

            return Ok(items);
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"❌ Error fetching order items: {ex}");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    [HttpPost("add-to-cart")]
    public async Task<IActionResult> AddToCart([FromBody] AddToCartRequest req)
    {
        if (req.UserId == 0 || req.ItemId == 0 || req.Quantity == 0 || req.Price == 0)
            return BadRequest(new { error = "All fields are required." });

        try
        {
            var user = await db.QueryFirstOrDefaultAsync<dynamic>(
                "SELECT address FROM users WHERE id = @UserId", new { req.UserId });

            if (user is null)
                return BadRequest(new { error = "Invalid user ID. Please log in again." });

            string? address = user.address;
            if (string.IsNullOrEmpty(address))
                return BadRequest(new { error = "You must add an address before adding items to your cart." });

            var existing = await db.QueryFirstOrDefaultAsync<OrderItem>(
                "SELECT * FROM OrderItems WHERE user_id = @UserId AND item_id = @ItemId",
                new { req.UserId, req.ItemId });

            if (existing is not null)
            {
                await db.ExecuteAsync(
                    "UPDATE OrderItems SET quantity = quantity + @Quantity WHERE user_id = @UserId AND item_id = @ItemId",
                    new { req.Quantity, req.UserId, req.ItemId });
            }
            else
            {
                await db.ExecuteAsync(
                    "INSERT INTO OrderItems (user_id, item_id, quantity, price) VALUES (@UserId, @ItemId, @Quantity, @Price)",
                    new { req.UserId, req.ItemId, req.Quantity, req.Price });
            }

            return Ok(new { message = "✅ Item added to cart successfully." });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"❌ Database error: {ex}");
            return StatusCode(500, new { error = "Database error", details = ex.Message });
        }
    }

    [HttpPut("orderitems/{item_id}")]
    public async Task<IActionResult> UpdateCartItem(int item_id, [FromBody] UpdateCartItemRequest req)
    {
        if (req.UserId == 0)
            return BadRequest(new { message = "Missing user_id or quantity" });

        try
        {
            if (req.Quantity < 1)
            {
                var deleted = await db.ExecuteAsync(
                    "DELETE FROM orderitems WHERE item_id = @ItemId AND user_id = @UserId",
                    new { ItemId = item_id, req.UserId });

                if (deleted == 0)
                    return NotFound(new { message = "Item not found or already removed" });

                return Ok(new { message = "Item removed from cart" });
            }

            var updated = await db.ExecuteAsync(
                "UPDATE orderitems SET quantity = @Quantity WHERE item_id = @ItemId AND user_id = @UserId",
                new { req.Quantity, ItemId = item_id, req.UserId });

            if (updated == 0)
                return NotFound(new { message = "Item not found" });

            return Ok(new { message = "Quantity updated successfully" });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"❌ Database error: {ex}");
            return StatusCode(500, new { message = "Internal Server Error" });
        }
    }

    [HttpDelete("orderitems/clear")]
    public async Task<IActionResult> ClearCart([FromBody] ClearCartRequest req)
    {
        if (req.UserId == 0)
            return BadRequest(new { message = "User ID is required" });

        try
        {
            await db.ExecuteAsync(
                "DELETE FROM OrderItems WHERE user_id = @UserId", new { req.UserId });

            return Ok(new { message = "All items removed from cart" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error clearing cart items", error = ex.Message });
        }
    }

    [HttpDelete("orderitems/{item_id}")]
    public async Task<IActionResult> DeleteCartItem(int item_id, [FromBody] DeleteCartItemRequest req)
    {
        if (req.UserId == 0)
            return BadRequest(new { error = "User ID is required" });

        try
        {
            var affected = await db.ExecuteAsync(
                "DELETE FROM OrderItems WHERE item_id = @ItemId AND user_id = @UserId",
                new { ItemId = item_id, req.UserId });

            if (affected == 0)
                return NotFound(new { message = "Item not found or already removed" });

            return Ok(new { message = "Item deleted successfully" });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"❌ Error deleting item: {ex}");
            return StatusCode(500, new { error = "Internal Server Error" });
        }
    }

    [HttpGet("cart-count")]
    public async Task<IActionResult> GetCartCount([FromQuery] int userId)
    {
        if (userId == 0)
            return BadRequest(new { error = "User ID is required" });

        try
        {
            var result = await db.QueryFirstOrDefaultAsync<dynamic>(
                "SELECT COUNT(*) as count FROM orderitems WHERE user_id = @UserId",
                new { UserId = userId });

            int count = (int)(result?.count ?? 0);
            return Ok(new { count });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error fetching cart count: {ex}");
            return StatusCode(500, new { error = "Server error while fetching cart count" });
        }
    }
}
=======
﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs.Cart;
using backend.Helpers;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CartController : ControllerBase
{
    private readonly ICartService _cart;
    public CartController(ICartService cart) => _cart = cart;

    [HttpGet]
    public async Task<IActionResult> GetCart()
        => Ok(await _cart.GetCartAsync(User.GetUserId()));

    [HttpGet("count")]
    public async Task<IActionResult> GetCount()
        => Ok(new { count = await _cart.GetCountAsync(User.GetUserId()) });

    [HttpPost]
    public async Task<IActionResult> Add([FromBody] AddToCartRequest request)
    {
        var item = await _cart.AddAsync(User.GetUserId(), request);
        if (item is null) return NotFound(new { error = "Menu item not found or unavailable" });
        return Ok(item);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateCartItemRequest request)
    {
        var result = await _cart.UpdateAsync(User.GetUserId(), id, request);
        if (result is null && request.Quantity > 0) return NotFound();
        return Ok(result ?? new CartItemDto { Id = id, Quantity = 0 });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Remove(int id)
    {
        var ok = await _cart.RemoveAsync(User.GetUserId(), id);
        return ok ? NoContent() : NotFound();
    }

    [HttpDelete]
    public async Task<IActionResult> Clear()
    {
        await _cart.ClearAsync(User.GetUserId());
        return NoContent();
    }
}
>>>>>>> origin/main
