using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class MenuItem
{
    public int Id { get; set; }

    public int CategoryId { get; set; }
    public Category? Category { get; set; }

    [Required, MaxLength(120)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    [Range(0, 9999.99)]
    public decimal Price { get; set; }

    [MaxLength(500)]
    public string? ImageUrl { get; set; }

    public bool IsAvailable { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}