using FoodDeliveryAPI.Data;
using FoodDeliveryAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace FoodDeliveryAPI.Controllers;

[ApiController]
[Route("api/admin")]
public class AdminController(DbService db) : ControllerBase
{
    // GET all orders
    [HttpGet("orders")]
    public async Task<IActionResult> GetOrders()
    {
        try
        {
            var orders = await db.QueryAsync<Order>("SELECT * FROM Orders ORDER BY id DESC");
            return Ok(orders);
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"❌ Error fetching orders: {ex}");
            return StatusCode(500, new { message = "Server error" });
        }
    }

    // POST add new menu item
    [HttpPost("items")]
    public async Task<IActionResult> AddItem([FromBody] Item item)
    {
        if (string.IsNullOrEmpty(item.Name) || item.Price == 0)
            return BadRequest(new { message = "Name and price are required" });

        try
        {
            await db.ExecuteAsync(
                "INSERT INTO items (name, price, category, imageURL) VALUES (@Name, @Price, @Category, @ImageURL)",
                new { item.Name, item.Price, item.Category, item.ImageURL });

            var inserted = await db.QueryFirstOrDefaultAsync<Item>(
                "SELECT * FROM items WHERE name = @Name ORDER BY id DESC LIMIT 1",
                new { item.Name });

            return StatusCode(201, inserted);
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"❌ Error adding item: {ex}");
            return StatusCode(500, new { message = "Server error" });
        }
    }

    // PUT update menu item
    [HttpPut("items/{id}")]
    public async Task<IActionResult> UpdateItem(int id, [FromBody] Item item)
    {
        try
        {
            var affected = await db.ExecuteAsync(
                "UPDATE items SET name = @Name, price = @Price, category = @Category, imageURL = @ImageURL WHERE id = @Id",
                new { item.Name, item.Price, item.Category, item.ImageURL, Id = id });

            if (affected == 0)
                return NotFound(new { message = "Item not found" });

            return Ok(new { message = "Item updated successfully" });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"❌ Error updating item: {ex}");
            return StatusCode(500, new { message = "Server error" });
        }
    }

    // DELETE menu item
    [HttpDelete("items/{id}")]
    public async Task<IActionResult> DeleteItem(int id)
    {
        try
        {
            var affected = await db.ExecuteAsync(
                "DELETE FROM items WHERE id = @Id", new { Id = id });

            if (affected == 0)
                return NotFound(new { message = "Item not found" });

            return Ok(new { message = "Item deleted successfully" });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"❌ Error deleting item: {ex}");
            return StatusCode(500, new { message = "Server error" });
        }
    }
}