using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Repositories;

public class CartRepository : ICartRepository
{
    private readonly ApplicationDbContext _db;
    public CartRepository(ApplicationDbContext db) => _db = db;

    public async Task<List<CartItem>> GetByUserAsync(int userId) =>
        await _db.CartItems
            .Include(c => c.MenuItem)
            .Where(c => c.UserId == userId)
            .ToListAsync();

    public async Task<CartItem?> FindAsync(int userId, int menuItemId) =>
        await _db.CartItems.FirstOrDefaultAsync(c => c.UserId == userId && c.MenuItemId == menuItemId);

    public async Task<CartItem?> GetByIdAsync(int id) =>
        await _db.CartItems.Include(c => c.MenuItem).FirstOrDefaultAsync(c => c.Id == id);

    public async Task AddAsync(CartItem item)
    {
        _db.CartItems.Add(item);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateAsync(CartItem item)
    {
        _db.CartItems.Update(item);
        await _db.SaveChangesAsync();
    }

    public async Task RemoveAsync(CartItem item)
    {
        _db.CartItems.Remove(item);
        await _db.SaveChangesAsync();
    }

    public async Task ClearAsync(int userId)
    {
        var items = await _db.CartItems.Where(c => c.UserId == userId).ToListAsync();
        _db.CartItems.RemoveRange(items);
        await _db.SaveChangesAsync();
    }
    public async Task<int> CountAsync(int userId) =>
    await _db.CartItems
        .Where(c => c.UserId == userId)
        .SumAsync(c => (int?)c.Quantity) ?? 0;
}