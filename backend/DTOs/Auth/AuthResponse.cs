namespace backend.DTOs.Auth;

public class AuthResponse
{
    public int UserId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string? FullName { get; set; }
    public string Role { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
}