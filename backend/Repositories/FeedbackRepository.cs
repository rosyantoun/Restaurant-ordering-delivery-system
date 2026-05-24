using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Repositories;

public class FeedbackRepository : IFeedbackRepository
{
    private readonly ApplicationDbContext _db;
    public FeedbackRepository(ApplicationDbContext db) => _db = db;

    public async Task<List<Feedback>> GetAllAsync() =>
        await _db.Feedbacks.OrderByDescending(f => f.CreatedAt).ToListAsync();

    public async Task AddAsync(Feedback feedback)
    {
        _db.Feedbacks.Add(feedback);
        await _db.SaveChangesAsync();
    }
}