using backend.DTOs.Menu;
using backend.Models;
using backend.Repositories;

namespace backend.Services;

public class AdminMenuService : IAdminMenuService
{
    private readonly IAdminMenuRepository _repo;
    public AdminMenuService(IAdminMenuRepository repo) => _repo = repo;

    public async Task<List<MenuItemDto>> GetAllAsync()
    {
        var items = await _repo.GetAllAsync();
        return items.Select(ToDto).ToList();
    }

    public async Task<MenuItemDto?> CreateAsync(MenuItemRequest request)
    {
        var item = new MenuItem
        {
            CategoryId = request.CategoryId,
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            ImageUrl = request.ImageUrl,
            IsAvailable = request.IsAvailable
        };
        await _repo.AddAsync(item);
        var refreshed = await _repo.GetByIdAsync(item.Id);
        return refreshed is null ? null : ToDto(refreshed);
    }

    public async Task<MenuItemDto?> UpdateAsync(int id, MenuItemRequest request)
    {
        var item = await _repo.GetByIdAsync(id);
        if (item is null) return null;

        item.CategoryId = request.CategoryId;
        item.Name = request.Name;
        item.Description = request.Description;
        item.Price = request.Price;
        item.ImageUrl = request.ImageUrl;
        item.IsAvailable = request.IsAvailable;
        await _repo.UpdateAsync(item);

        var refreshed = await _repo.GetByIdAsync(id);
        return refreshed is null ? null : ToDto(refreshed);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var item = await _repo.GetByIdAsync(id);
        if (item is null) return false;
        await _repo.RemoveAsync(item);
        return true;
    }

    private static MenuItemDto ToDto(MenuItem m) => new()
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