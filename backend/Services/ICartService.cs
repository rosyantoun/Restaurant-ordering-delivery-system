using backend.DTOs.Cart;

namespace backend.Services;

public interface ICartService
{
    Task<List<CartItemDto>> GetCartAsync(int userId);
    Task<int> GetCountAsync(int userId);
    Task<CartItemDto?> AddAsync(int userId, AddToCartRequest request);
    Task<CartItemDto?> UpdateAsync(int userId, int cartItemId, UpdateCartItemRequest request);
    Task<bool> RemoveAsync(int userId, int cartItemId);
    Task ClearAsync(int userId);
}