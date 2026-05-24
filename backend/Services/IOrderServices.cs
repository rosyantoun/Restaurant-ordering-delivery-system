using backend.DTOs.Order;

namespace backend.Services;

public interface IOrderService
{
    Task<OrderDto?> CheckoutAsync(int userId, CheckoutRequest request);
    Task<List<OrderDto>> GetByUserAsync(int userId);
    Task<OrderDto?> GetByIdAsync(int id, int userId, bool isAdmin);
    Task<List<OrderDto>> GetAllAsync();
    Task<bool> ReorderAsync(int orderId, int userId);
    Task<OrderDto?> UpdateStatusAsync(int orderId, string status);
}