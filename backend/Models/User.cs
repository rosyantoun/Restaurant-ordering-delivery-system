using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class User
{
    public int Id { get; set; }

    [Required, MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? FullName { get; set; }

    [MaxLength(30)]
    public string? PhoneNumber { get; set; }

    [Required, MaxLength(20)]
    public string Role { get; set; } = "Customer";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Address> Addresses { get; set; } = new List<Address>();
    public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    public ICollection<Order> Orders { get; set; } = new List<Order>();
    public ICollection<Feedback> Feedbacks { get; set; } = new List<Feedback>();
}