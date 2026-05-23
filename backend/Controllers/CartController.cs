using Microsoft.AspNetCore.Authorization;
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