using backend.DTOs.Feedback;
using backend.Models;
using backend.Repositories;

namespace backend.Services;

public class FeedbackService : IFeedbackService
{
    private readonly IFeedbackRepository _repo;
    public FeedbackService(IFeedbackRepository repo) => _repo = repo;

    public async Task<List<FeedbackDto>> GetAllAsync()
    {
        var items = await _repo.GetAllAsync();
        return items.Select(f => new FeedbackDto
        {
            Id = f.Id,
            Name = f.Name,
            Rating = f.Rating,
            Comment = f.Comment,
            ImagePath = f.ImagePath,
            CreatedAt = f.CreatedAt
        }).ToList();
    }

    public async Task<FeedbackDto> AddAsync(FeedbackRequest request, int? userId)
    {
        var feedback = new Feedback
        {
            UserId = userId,
            Name = request.Name,
            Rating = request.Rating,
            Comment = request.Comment,
            ImagePath = request.ImagePath
        };
        await _repo.AddAsync(feedback);
        return new FeedbackDto
        {
            Id = feedback.Id,
            Name = feedback.Name,
            Rating = feedback.Rating,
            Comment = feedback.Comment,
            ImagePath = feedback.ImagePath,
            CreatedAt = feedback.CreatedAt
        };
    }
}