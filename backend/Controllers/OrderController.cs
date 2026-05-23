using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs.Order;
using backend.Helpers;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orders;
    public OrdersController(IOrderService orders) => _orders = orders;

    [HttpPost("checkout")]
    public async Task<IActionResult> Checkout([FromBody] CheckoutRequest request)
    {
        var result = await _orders.CheckoutAsync(User.GetUserId(), request);
        if (result is null) return BadRequest(new { error = "Cart is empty or address invalid" });
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpGet]
    public async Task<IActionResult> GetMine()
        => Ok(await _orders.GetByUserAsync(User.GetUserId()));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var isAdmin = User.IsInRole("Admin");
        var order = await _orders.GetByIdAsync(id, User.GetUserId(), isAdmin);
        return order is null ? NotFound() : Ok(order);
    }

    [HttpPost("{id}/reorder")]
    public async Task<IActionResult> Reorder(int id)
    {
        var ok = await _orders.ReorderAsync(id, User.GetUserId());
        return ok ? Ok(new { message = "Items added to cart" }) : NotFound();
    }
}