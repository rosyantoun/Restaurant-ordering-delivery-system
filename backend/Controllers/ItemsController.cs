using FoodDeliveryAPI.Data;
using Microsoft.AspNetCore.Mvc;

namespace FoodDeliveryAPI.Controllers;

[ApiController]
[Route("api")]
public class ItemsController(DbService db) : ControllerBase
{
    [HttpGet("items")]
    public async Task<IActionResult> GetItems()
    {
        try
        {
            var items = await db.GetAllItemsAsync();
            return Ok(items);
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error fetching items: {ex.Message}");
            return StatusCode(500, "Error fetching items");
        }
    }
}
