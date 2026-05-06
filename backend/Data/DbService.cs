using Dapper;
using FoodDeliveryAPI.Models;
using MySql.Data.MySqlClient;

namespace FoodDeliveryAPI.Data;

public class DbService
{
    private readonly string _connectionString;

    public DbService(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
    }

    private MySqlConnection CreateConnection() => new(_connectionString);

    public async Task<IEnumerable<T>> QueryAsync<T>(string sql, object? param = null)
    {
        await using var conn = CreateConnection();
        return await conn.QueryAsync<T>(sql, param);
    }

    public async Task<T?> QueryFirstOrDefaultAsync<T>(string sql, object? param = null)
    {
        await using var conn = CreateConnection();
        return await conn.QueryFirstOrDefaultAsync<T>(sql, param);
    }

    public async Task<int> ExecuteAsync(string sql, object? param = null)
    {
        await using var conn = CreateConnection();
        return await conn.ExecuteAsync(sql, param);
    }

    public async Task<IEnumerable<Item>> GetAllItemsAsync()
    {
        return await QueryAsync<Item>("SELECT id, name, imageURL, price, category FROM items");
    }
}