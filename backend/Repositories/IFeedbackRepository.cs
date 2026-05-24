using backend.Models;

namespace backend.Repositories;

public interface IFeedbackRepository
{
    Task<List<Feedback>> GetAllAsync();
    Task AddAsync(Feedback feedback);
}