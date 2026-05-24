using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs.Address;
using backend.Helpers;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AddressesController : ControllerBase
{
    private readonly IAddressService _addresses;
    public AddressesController(IAddressService addresses) => _addresses = addresses;

    [HttpGet]
    public async Task<IActionResult> GetMine()
        => Ok(await _addresses.GetByUserAsync(User.GetUserId()));

    [HttpPost]
    public async Task<IActionResult> Add([FromBody] AddressRequest request)
    {
        var address = await _addresses.AddAsync(User.GetUserId(), request);
        return CreatedAtAction(nameof(Add), address);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] AddressRequest request)
    {
        var result = await _addresses.UpdateAsync(User.GetUserId(), id, request);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Remove(int id)
    {
        var ok = await _addresses.RemoveAsync(User.GetUserId(), id);
        return ok ? NoContent() : NotFound();
    }
}