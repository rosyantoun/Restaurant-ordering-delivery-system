using backend.Models;

namespace backend.Data;

public static class DbSeeder
{
    public static void Seed(ApplicationDbContext db)
    {
        db.Database.EnsureCreated();

        if (!db.Categories.Any())
        {
            db.Categories.AddRange(
                new Category { Name = "Burger", DisplayOrder = 1 },
                new Category { Name = "Pizza", DisplayOrder = 2 },
                new Category { Name = "Pasta", DisplayOrder = 3 },
                new Category { Name = "Appetizers", DisplayOrder = 4 }
            );
            db.SaveChanges();
        }

        if (!db.Users.Any())
        {
            db.Users.Add(new User
            {
                Email = "admin@tastybites.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                FullName = "Tasty Bites Admin",
                Role = "Admin"
            });
            db.SaveChanges();
        }

        if (!db.MenuItems.Any())
        {
            var burgerId = db.Categories.First(c => c.Name == "Burger").Id;
            var pizzaId = db.Categories.First(c => c.Name == "Pizza").Id;
            var pastaId = db.Categories.First(c => c.Name == "Pasta").Id;
            var apptId = db.Categories.First(c => c.Name == "Appetizers").Id;

            db.MenuItems.AddRange(
                new MenuItem { CategoryId = burgerId, Name = "Classic Beef Burger", Description = "Juicy beef patty with lettuce, tomato, and cheddar.", Price = 8.50m, ImageUrl = "/images/b1.png" },
                new MenuItem { CategoryId = burgerId, Name = "Chicken Burger", Description = "Crispy chicken fillet with creamy sauce.", Price = 7.50m, ImageUrl = "/images/chickenb1.png" },
                new MenuItem { CategoryId = burgerId, Name = "Double Cheese Burger", Description = "Two patties, double cheese, soft bun.", Price = 10.00m, ImageUrl = "/images/doubleb1.png" },
                new MenuItem { CategoryId = pizzaId, Name = "Margherita Pizza", Description = "Tomato, mozzarella, fresh basil.", Price = 9.00m, ImageUrl = "/images/marg.png" },
                new MenuItem { CategoryId = pizzaId, Name = "Pepperoni Pizza", Description = "Pepperoni, mozzarella, oregano.", Price = 11.00m, ImageUrl = "/images/pizza2.png" },
                new MenuItem { CategoryId = pizzaId, Name = "Veggie Pizza", Description = "Olives, peppers, mushrooms, onions.", Price = 9.50m, ImageUrl = "/images/pizza3.png" },
                new MenuItem { CategoryId = pastaId, Name = "Spaghetti Bolognese", Description = "Classic beef ragu over al dente spaghetti.", Price = 9.00m, ImageUrl = "/images/pasta.png" },
                new MenuItem { CategoryId = pastaId, Name = "Penne Arrabbiata", Description = "Spicy tomato sauce with garlic and chili.", Price = 8.50m, ImageUrl = "/images/pastaa.png" },
                new MenuItem { CategoryId = pastaId, Name = "Fettuccine Alfredo", Description = "Creamy parmesan sauce over fettuccine.", Price = 9.50m, ImageUrl = "/images/alfropasta.png" },
                new MenuItem { CategoryId = apptId, Name = "French Fries", Description = "Golden crispy fries.", Price = 3.50m, ImageUrl = "/images/fries.png" },
                new MenuItem { CategoryId = apptId, Name = "Mozzarella Sticks", Description = "Crispy outside, melted cheese inside.", Price = 5.00m, ImageUrl = "/images/mozarella.png" },
                new MenuItem { CategoryId = apptId, Name = "Chicken Wings", Description = "Six wings tossed in your favorite sauce.", Price = 6.50m, ImageUrl = "/images/wings.png" }
            );
            db.SaveChanges();
        }


        if (!db.Feedbacks.Any())
        {
            db.Feedbacks.AddRange(
                new Feedback { Name = "Sara K.", Rating = 5, Comment = "The burgers are amazing! Fast delivery too.", ImagePath = null },
                new Feedback { Name = "Karim M.", Rating = 4, Comment = "Great pizza, will order again.", ImagePath = null },
                new Feedback { Name = "Lina A.", Rating = 5, Comment = "Best pasta in town, generous portions.", ImagePath = null }
            );
            db.SaveChanges();
        }
    }
}