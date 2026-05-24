using backend.Models;

namespace backend.Repositories;

public interface IAddressRepository
{
    Task<List<Address>> GetByUserAsync(int userId);
    Task<Address?> GetByIdAsync(int id);
    Task AddAsync(Address address);
    Task UpdateAsync(Address address);
    Task RemoveAsync(Address address);
    Task ClearDefaultsAsync(int userId);
}