using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/admin/menu")]
    [Authorize(Roles = "Admin")]
    public class AdminMenuController : ControllerBase
    {
        // Serena will implement menu CRUD endpoints here
    }
}