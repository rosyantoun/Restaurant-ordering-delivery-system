using backend.DTOs.Order;
using backend.Models;
using backend.Repositories;

namespace backend.Services;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orders;
    private readonly ICartRepository _cart;
    private readonly IAddressRepository _addresses;

    public OrderService(IOrderRepository orders, ICartRepository cart, IAddressRepository addresses)
    {
        _orders = orders;
        _cart = cart;
        _addresses = addresses;
    }

    public async Task<OrderDto?> CheckoutAsync(int userId, CheckoutRequest request)
    {
        var cartItems = await _cart.GetByUserAsync(userId);
        if (cartItems.Count == 0) return null;

        Address? address = null;
        if (request.AddressId.HasValue)
        {
            address = await _addresses.GetByIdAsync(request.AddressId.Value);
            if (address is null || address.UserId != userId) return null;
        }

        var orderItems = cartItems.Select(ci => new OrderItem
        {
            MenuItemId = ci.MenuItemId,
            ItemName = ci.MenuItem?.Name ?? "Unknown item",
            UnitPrice = ci.MenuItem?.Price ?? 0,
            Quantity = ci.Quantity
        }).ToList();

        var total = orderItems.Sum(oi => oi.UnitPrice * oi.Quantity);

        var order = new Order
        {
            UserId = userId,
            AddressId = address?.Id,
            TotalPrice = total,
            PaymentInfo = request.PaymentInfo,
            Status = OrderStatus.Pending,
            OrderItems = orderItems
        };

        var created = await _orders.CreateAsync(order);
        await _cart.ClearAsync(userId);

        var full = await _orders.GetByIdAsync(created.Id);
        return full is null ? null : ToDto(full);
    }

    public async Task<List<OrderDto>> GetByUserAsync(int userId)
    {
        var orders = await _orders.GetByUserAsync(userId);
        return orders.Select(ToDto).ToList();
    }

    public async Task<OrderDto?> GetByIdAsync(int id, int userId, bool isAdmin)
    {
        var order = await _orders.GetByIdAsync(id);
        if (order is null) return null;
        if (!isAdmin && order.UserId != userId) return null;
        return ToDto(order);
    }

    public async Task<List<OrderDto>> GetAllAsync()
    {
        var orders = await _orders.GetAllAsync();
        return orders.Select(ToDto).ToList();
    }

    public async Task<bool> ReorderAsync(int orderId, int userId)
    {
        var order = await _orders.GetByIdAsync(orderId);
        if (order is null || order.UserId != userId) return false;

        foreach (var oi in order.OrderItems)
        {
            if (oi.MenuItemId is null) continue;
            var existing = await _cart.FindAsync(userId, oi.MenuItemId.Value);
            if (existing is null)
            {
                await _cart.AddAsync(new CartItem
                {
                    UserId = userId,
                    MenuItemId = oi.MenuItemId.Value,
                    Quantity = oi.Quantity
                });
            }
            else
            {
                existing.Quantity += oi.Quantity;
                await _cart.UpdateAsync(existing);
            }
        }
        return true;
    }

    public async Task<OrderDto?> UpdateStatusAsync(int orderId, string status)
    {
        var order = await _orders.GetByIdAsync(orderId);
        if (order is null) return null;

        if (!Enum.TryParse<OrderStatus>(status, true, out var parsed)) return null;
        order.Status = parsed;
        await _orders.UpdateAsync(order);

        var refreshed = await _orders.GetByIdAsync(orderId);
        return refreshed is null ? null : ToDto(refreshed);
    }

    private static OrderDto ToDto(Order o) => new()
    {
        Id = o.Id,
        UserId = o.UserId,
        UserEmail = o.User?.Email,
        AddressId = o.AddressId,
        AddressText = o.Address?.FullAddress,
        TotalPrice = o.TotalPrice,
        PaymentInfo = o.PaymentInfo,
        Status = o.Status.ToString(),
        CreatedAt = o.CreatedAt,
        Items = o.OrderItems.Select(oi => new OrderItemDto
        {
            Id = oi.Id,
            MenuItemId = oi.MenuItemId,
            ItemName = oi.ItemName,
            UnitPrice = oi.UnitPrice,
            Quantity = oi.Quantity,
            Subtotal = oi.UnitPrice * oi.Quantity,
            ImageUrl = oi.MenuItem?.ImageUrl
        }).ToList()
    };
}