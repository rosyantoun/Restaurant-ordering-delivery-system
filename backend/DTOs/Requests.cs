namespace FoodDeliveryAPI.DTOs;

public record LoginRequest(string Email, string Password);

public record SignupRequest(string Email, string Password);

public record AddToCartRequest(int UserId, int ItemId, int Quantity, decimal Price);

public record UpdateCartItemRequest(int UserId, int Quantity);

public record ClearCartRequest(int UserId);

public record DeleteCartItemRequest(int UserId);

public record PlaceOrderRequest(string Name, string PhoneNumber, string Email, string Address);

public record CreateOrderRequest(int UserId, decimal TotalPrice, string PaymentInfo, string Items);

public record FeedbackRequest(string Name, int Rating, string Comment, string? ImagePath);
