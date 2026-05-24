using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Feedback
{
    public int Id { get; set; }

    public int? UserId { get; set; }
    public User? User { get; set; }

    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Range(1, 5)]
    public int Rating { get; set; }

    [Required, MaxLength(1000)]
    public string Comment { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? ImagePath { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}