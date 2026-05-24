using backend.DTOs.Feedback;

namespace backend.Services;

public interface IFeedbackService
{
    Task<List<FeedbackDto>> GetAllAsync();
    Task<FeedbackDto> AddAsync(FeedbackRequest request, int? userId);
}