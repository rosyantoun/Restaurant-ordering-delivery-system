using backend.Models;

namespace backend.Repositories;

public interface IAdminMenuRepository
{
    Task<List<MenuItem>> GetAllAsync();
    Task<MenuItem?> GetByIdAsync(int id);
    Task AddAsync(MenuItem item);
    Task UpdateAsync(MenuItem item);
    Task RemoveAsync(MenuItem item);
}