using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Category
{
    public int Id { get; set; }

    [Required, MaxLength(60)]
    public string Name { get; set; } = string.Empty;

    public int DisplayOrder { get; set; } = 0;

    public ICollection<MenuItem> MenuItems { get; set; } = new List<MenuItem>();
}