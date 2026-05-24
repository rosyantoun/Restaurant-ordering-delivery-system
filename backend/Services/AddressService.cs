using backend.DTOs.Address;
using backend.Models;
using backend.Repositories;

namespace backend.Services;

public class AddressService : IAddressService
{
    private readonly IAddressRepository _repo;
    public AddressService(IAddressRepository repo) => _repo = repo;

    public async Task<List<AddressDto>> GetByUserAsync(int userId)
    {
        var items = await _repo.GetByUserAsync(userId);
        return items.Select(ToDto).ToList();
    }

    public async Task<AddressDto> AddAsync(int userId, AddressRequest request)
    {
        if (request.IsDefault) await _repo.ClearDefaultsAsync(userId);

        var address = new Address
        {
            UserId = userId,
            Label = request.Label,
            FullAddress = request.FullAddress,
            PhoneNumber = request.PhoneNumber,
            IsDefault = request.IsDefault
        };
        await _repo.AddAsync(address);
        return ToDto(address);
    }

    public async Task<AddressDto?> UpdateAsync(int userId, int id, AddressRequest request)
    {
        var address = await _repo.GetByIdAsync(id);
        if (address is null || address.UserId != userId) return null;

        if (request.IsDefault) await _repo.ClearDefaultsAsync(userId);

        address.Label = request.Label;
        address.FullAddress = request.FullAddress;
        address.PhoneNumber = request.PhoneNumber;
        address.IsDefault = request.IsDefault;
        await _repo.UpdateAsync(address);
        return ToDto(address);
    }

    public async Task<bool> RemoveAsync(int userId, int id)
    {
        var address = await _repo.GetByIdAsync(id);
        if (address is null || address.UserId != userId) return false;
        await _repo.RemoveAsync(address);
        return true;
    }

    private static AddressDto ToDto(Address a) => new()
    {
        Id = a.Id,
        Label = a.Label,
        FullAddress = a.FullAddress,
        PhoneNumber = a.PhoneNumber,
        IsDefault = a.IsDefault
    };
}