using backend.DTOs.Menu;
using backend.Repositories;

namespace backend.Services;

public class MenuService : IMenuService
{
    private readonly IMenuItemRepository _repo;
    public MenuService(IMenuItemRepository repo) => _repo = repo;

    public async Task<List<MenuItemDto>> GetMenuAsync(int? categoryId, string? search)
    {
        var items = await _repo.GetAllAsync(categoryId, search);
        return items.Select(m => new MenuItemDto
        {
            Id = m.Id,
            CategoryId = m.CategoryId,
            CategoryName = m.Category?.Name ?? string.Empty,
            Name = m.Name,
            Description = m.Description,
            Price = m.Price,
            ImageUrl = m.ImageUrl,
            IsAvailable = m.IsAvailable
        }).ToList();
    }

    public async Task<MenuItemDto?> GetByIdAsync(int id)
    {
        var m = await _repo.GetByIdAsync(id);
        if (m is null) return null;
        return new MenuItemDto
        {
            Id = m.Id,
            CategoryId = m.CategoryId,
            CategoryName = m.Category?.Name ?? string.Empty,
            Name = m.Name,
            Description = m.Description,
            Price = m.Price,
            ImageUrl = m.ImageUrl,
            IsAvailable = m.IsAvailable
        };
    }

    public async Task<List<CategoryDto>> GetCategoriesAsync()
    {
        var cats = await _repo.GetCategoriesAsync();
        return cats.Select(c => new CategoryDto
        {
            Id = c.Id,
            Name = c.Name,
            DisplayOrder = c.DisplayOrder
        }).ToList();
    }
}