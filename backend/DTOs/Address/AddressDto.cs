namespace backend.DTOs.Address;

public class AddressDto
{
    public int Id { get; set; }
    public string? Label { get; set; }
    public string FullAddress { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public bool IsDefault { get; set; }
}