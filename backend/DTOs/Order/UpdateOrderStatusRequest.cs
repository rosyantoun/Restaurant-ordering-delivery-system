using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Order;

public class UpdateOrderStatusRequest
{
    [Required]
    public string Status { get; set; } = string.Empty;
}