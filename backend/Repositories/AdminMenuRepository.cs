using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Repositories;

public class AdminMenuRepository : IAdminMenuRepository
{
    private readonly ApplicationDbContext _db;
    public AdminMenuRepository(ApplicationDbContext db) => _db = db;

    public async Task<List<MenuItem>> GetAllAsync() =>
        await _db.MenuItems.Include(m => m.Category).OrderBy(m => m.Id).ToListAsync();

    public async Task<MenuItem?> GetByIdAsync(int id) =>
        await _db.MenuItems.Include(m => m.Category).FirstOrDefaultAsync(m => m.Id == id);

    public async Task AddAsync(MenuItem item)
    {
        _db.MenuItems.Add(item);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateAsync(MenuItem item)
    {
        _db.MenuItems.Update(item);
        await _db.SaveChangesAsync();
    }

    public async Task RemoveAsync(MenuItem item)
    {
        _db.MenuItems.Remove(item);
        await _db.SaveChangesAsync();
    }
}