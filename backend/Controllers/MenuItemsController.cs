using Microsoft.AspNetCore.Mvc;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/menu")]
public class MenuItemsController : ControllerBase
{
    private readonly IMenuService _menu;
    public MenuItemsController(IMenuService menu) => _menu = menu;

    [HttpGet("items")]
    public async Task<IActionResult> GetMenu([FromQuery] int? categoryId, [FromQuery] string? search)
        => Ok(await _menu.GetMenuAsync(categoryId, search));

    [HttpGet("items/{id}")]
    public async Task<IActionResult> GetItem(int id)
    {
        var item = await _menu.GetByIdAsync(id);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
        => Ok(await _menu.GetCategoriesAsync());
}