using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Address;

public class AddressRequest
{
    [MaxLength(50)]
    public string? Label { get; set; }

    [Required, MaxLength(300)]
    public string FullAddress { get; set; } = string.Empty;

    [MaxLength(30)]
    public string? PhoneNumber { get; set; }

    public bool IsDefault { get; set; }
}