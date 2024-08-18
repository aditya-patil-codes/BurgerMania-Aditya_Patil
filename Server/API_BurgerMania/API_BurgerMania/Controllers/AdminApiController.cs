using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_BurgerMania.Controllers
{
    public class AdminApiController : Controller
    {
        [Authorize(policy: "AdminOnly")]

        public IActionResult Index()
        {
            return View();
        }
    }
}
