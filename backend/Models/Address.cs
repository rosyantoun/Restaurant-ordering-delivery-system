using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Address
{
    public int Id { get; set; }

    public int UserId { get; set; }
    public User? User { get; set; }

    [MaxLength(50)]
    public string? Label { get; set; }

    [Required, MaxLength(300)]
    public string FullAddress { get; set; } = string.Empty;

    [MaxLength(30)]
    public string? PhoneNumber { get; set; }

    public bool IsDefault { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}