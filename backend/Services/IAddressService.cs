using backend.DTOs.Address;

namespace backend.Services;

public interface IAddressService
{
    Task<List<AddressDto>> GetByUserAsync(int userId);
    Task<AddressDto> AddAsync(int userId, AddressRequest request);
    Task<AddressDto?> UpdateAsync(int userId, int id, AddressRequest request);
    Task<bool> RemoveAsync(int userId, int id);
}