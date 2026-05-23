using backend.Models;

namespace backend.Repositories;

public interface IOrderRepository
{
    Task<Order> CreateAsync(Order order);
    Task<List<Order>> GetByUserAsync(int userId);
    Task<Order?> GetByIdAsync(int id);
    Task<List<Order>> GetAllAsync();
    Task UpdateAsync(Order order);
}