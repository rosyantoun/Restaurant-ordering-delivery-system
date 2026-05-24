using backend.Models;

namespace backend.Repositories;

public interface IMenuItemRepository
{
    Task<List<MenuItem>> GetAllAsync(int? categoryId, string? search);
    Task<MenuItem?> GetByIdAsync(int id);
    Task<List<Category>> GetCategoriesAsync();
}