using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Cart;

public class AddToCartRequest
{
    [Required]
    public int MenuItemId { get; set; }

    [Range(1, 999)]
    public int Quantity { get; set; } = 1;
}