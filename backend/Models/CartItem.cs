using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class CartItem
{
    public int Id { get; set; }

    public int UserId { get; set; }
    public User? User { get; set; }

    public int MenuItemId { get; set; }
    public MenuItem? MenuItem { get; set; }

    [Range(1, 999)]
    public int Quantity { get; set; }

    public DateTime AddedAt { get; set; } = DateTime.UtcNow;
}