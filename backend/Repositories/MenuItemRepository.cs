using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Repositories;

public class MenuItemRepository : IMenuItemRepository
{
    private readonly ApplicationDbContext _db;
    public MenuItemRepository(ApplicationDbContext db) => _db = db;

    public async Task<List<MenuItem>> GetAllAsync(int? categoryId, string? search)
    {
        var query = _db.MenuItems.Include(m => m.Category).AsQueryable();

        if (categoryId.HasValue)
            query = query.Where(m => m.CategoryId == categoryId.Value);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            query = query.Where(m => m.Name.ToLower().Contains(s));
        }

        query = query.Where(m => m.IsAvailable);

        return await query.OrderBy(m => m.Category!.DisplayOrder).ThenBy(m => m.Name).ToListAsync();
    }

    public async Task<MenuItem?> GetByIdAsync(int id) =>
        await _db.MenuItems.Include(m => m.Category).FirstOrDefaultAsync(m => m.Id == id);

    public async Task<List<Category>> GetCategoriesAsync() =>
        await _db.Categories.OrderBy(c => c.DisplayOrder).ToListAsync();
}