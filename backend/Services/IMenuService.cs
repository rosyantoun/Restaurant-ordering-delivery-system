using backend.DTOs.Menu;

namespace backend.Services;

public interface IMenuService
{
    Task<List<MenuItemDto>> GetMenuAsync(int? categoryId, string? search);
    Task<MenuItemDto?> GetByIdAsync(int id);
    Task<List<CategoryDto>> GetCategoriesAsync();
}