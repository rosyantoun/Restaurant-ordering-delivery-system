namespace FoodDeliveryAPI.Models;

public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? Name { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Address { get; set; }
}

public class Item
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? ImageURL { get; set; }
    public decimal Price { get; set; }
    public string? Category { get; set; }
}

public class OrderItem
{
    public int ItemId { get; set; }
    public int UserId { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public string? Name { get; set; }
    public string? ImageURL { get; set; }
}

public class Order
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public decimal TotalPrice { get; set; }
    public string PaymentInfo { get; set; } = string.Empty;
    public string Items { get; set; } = string.Empty;
    public DateTime? CreatedAt { get; set; }
}

public class Feedback
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public string? ImagePath { get; set; }
}