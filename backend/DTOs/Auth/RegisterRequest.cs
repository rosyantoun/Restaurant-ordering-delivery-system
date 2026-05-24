using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Auth;

public class RegisterRequest
{
    [Required, EmailAddress, MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    [Required, MinLength(6), MaxLength(100)]
    public string Password { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? FullName { get; set; }

    [MaxLength(30)]
    public string? PhoneNumber { get; set; }
}