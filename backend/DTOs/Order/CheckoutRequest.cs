using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Order;

public class CheckoutRequest
{
    public int? AddressId { get; set; }

    [MaxLength(200)]
    public string? PaymentInfo { get; set; }
}