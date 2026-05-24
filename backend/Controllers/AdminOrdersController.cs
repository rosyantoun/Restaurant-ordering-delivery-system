using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs.Order;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/admin/orders")]
[Authorize(Roles = "Admin")]
public class AdminOrdersController : ControllerBase
{
    private readonly IOrderService _orders;

    public AdminOrdersController(IOrderService orders)
    {
        _orders = orders;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllOrders()
        => Ok(await _orders.GetAllAsync());

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateOrderStatusRequest request)
    {
        var result = await _orders.UpdateStatusAsync(id, request.Status);
        return result is null ? BadRequest(new { error = "Invalid order or status" }) : Ok(result);
    }
}