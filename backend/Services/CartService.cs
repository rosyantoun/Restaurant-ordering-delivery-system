using backend.DTOs.Cart;
using backend.Models;
using backend.Repositories;

namespace backend.Services;

public class CartService : ICartService
{
    private readonly ICartRepository _cart;
    private readonly IMenuItemRepository _menu;
    public CartService(ICartRepository cart, IMenuItemRepository menu)
    {
        _cart = cart;
        _menu = menu;
    }

    public async Task<List<CartItemDto>> GetCartAsync(int userId)
    {
        var items = await _cart.GetByUserAsync(userId);
        return items.Select(ToDto).ToList();
    }

    public async Task<int> GetCountAsync(int userId) => await _cart.CountAsync(userId);

    public async Task<CartItemDto?> AddAsync(int userId, AddToCartRequest request)
    {
        var menuItem = await _menu.GetByIdAsync(request.MenuItemId);
        if (menuItem is null || !menuItem.IsAvailable) return null;

        var existing = await _cart.FindAsync(userId, request.MenuItemId);
        if (existing is not null)
        {
            existing.Quantity += request.Quantity;
            await _cart.UpdateAsync(existing);
            existing.MenuItem = menuItem;
            return ToDto(existing);
        }

        var newItem = new CartItem
        {
            UserId = userId,
            MenuItemId = request.MenuItemId,
            Quantity = request.Quantity
        };
        await _cart.AddAsync(newItem);
        newItem.MenuItem = menuItem;
        return ToDto(newItem);
    }

    public async Task<CartItemDto?> UpdateAsync(int userId, int cartItemId, UpdateCartItemRequest request)
    {
        var item = await _cart.GetByIdAsync(cartItemId);
        if (item is null || item.UserId != userId) return null;

        if (request.Quantity <= 0)
        {
            await _cart.RemoveAsync(item);
            return null;
        }

        item.Quantity = request.Quantity;
        await _cart.UpdateAsync(item);
        return ToDto(item);
    }

    public async Task<bool> RemoveAsync(int userId, int cartItemId)
    {
        var item = await _cart.GetByIdAsync(cartItemId);
        if (item is null || item.UserId != userId) return false;
        await _cart.RemoveAsync(item);
        return true;
    }

    public async Task ClearAsync(int userId) => await _cart.ClearAsync(userId);

    private static CartItemDto ToDto(CartItem item) => new()
    {
        Id = item.Id,
        MenuItemId = item.MenuItemId,
        Name = item.MenuItem?.Name ?? string.Empty,
        ImageUrl = item.MenuItem?.ImageUrl,
        UnitPrice = item.MenuItem?.Price ?? 0,
        Quantity = item.Quantity,
        Subtotal = (item.MenuItem?.Price ?? 0) * item.Quantity
    };
}