namespace backend.DTOs.Order;

public class OrderDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string? UserEmail { get; set; }
    public int? AddressId { get; set; }
    public string? AddressText { get; set; }
    public decimal TotalPrice { get; set; }
    public string? PaymentInfo { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public List<OrderItemDto> Items { get; set; } = new();
}