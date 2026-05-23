using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Repositories;

public class AddressRepository : IAddressRepository
{
    private readonly ApplicationDbContext _db;
    public AddressRepository(ApplicationDbContext db) => _db = db;

    public async Task<List<Address>> GetByUserAsync(int userId) =>
        await _db.Addresses.Where(a => a.UserId == userId).OrderByDescending(a => a.IsDefault).ToListAsync();

    public async Task<Address?> GetByIdAsync(int id) =>
        await _db.Addresses.FindAsync(id);

    public async Task AddAsync(Address address)
    {
        _db.Addresses.Add(address);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateAsync(Address address)
    {
        _db.Addresses.Update(address);
        await _db.SaveChangesAsync();
    }

    public async Task RemoveAsync(Address address)
    {
        _db.Addresses.Remove(address);
        await _db.SaveChangesAsync();
    }

    public async Task ClearDefaultsAsync(int userId)
    {
        var defaults = await _db.Addresses.Where(a => a.UserId == userId && a.IsDefault).ToListAsync();
        foreach (var a in defaults) a.IsDefault = false;
        await _db.SaveChangesAsync();
    }
}