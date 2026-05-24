using backend.DTOs.Menu;

namespace backend.Services;

public interface IAdminMenuService
{
    Task<List<MenuItemDto>> GetAllAsync();
    Task<MenuItemDto?> CreateAsync(MenuItemRequest request);
    Task<MenuItemDto?> UpdateAsync(int id, MenuItemRequest request);
    Task<bool> DeleteAsync(int id);
}