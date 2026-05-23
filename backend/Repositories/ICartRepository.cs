using backend.Models;

namespace backend.Repositories;

public interface ICartRepository
{
    Task<List<CartItem>> GetByUserAsync(int userId);
    Task<CartItem?> FindAsync(int userId, int menuItemId);
    Task<CartItem?> GetByIdAsync(int id);
    Task AddAsync(CartItem item);
    Task UpdateAsync(CartItem item);
    Task RemoveAsync(CartItem item);
    Task ClearAsync(int userId);
    Task<int> CountAsync(int userId);
}