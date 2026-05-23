using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs.Menu;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/admin/menu")]
[Authorize(Roles = "Admin")]
public class AdminMenuController : ControllerBase
{
    private readonly IAdminMenuService _menu;

    public AdminMenuController(IAdminMenuService menu)
    {
        _menu = menu;
    }

    [HttpGet]
    public async Task<IActionResult> GetMenu()
        => Ok(await _menu.GetAllAsync());

    [HttpPost]
    public async Task<IActionResult> CreateMenuItem([FromBody] MenuItemRequest request)
    {
        var item = await _menu.CreateAsync(request);
        return item is null ? BadRequest() : CreatedAtAction(nameof(GetMenu), item);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMenuItem(int id, [FromBody] MenuItemRequest request)
    {
        var item = await _menu.UpdateAsync(id, request);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMenuItem(int id)
    {
        var ok = await _menu.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }
}