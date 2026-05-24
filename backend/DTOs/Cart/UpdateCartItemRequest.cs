using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Cart;

public class UpdateCartItemRequest
{
    [Range(0, 999)]
    public int Quantity { get; set; }
}