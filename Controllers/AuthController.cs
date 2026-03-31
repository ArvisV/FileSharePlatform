using Microsoft.AspNetCore.Mvc;
using FileSharePlatform.Services;
using FileSharePlatform.Models;
using FileSharePlatform.DTOs;

namespace FileSharePlatform.Controllers
{
    public class AuthController : Controller
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost]
        public IActionResult Register([FromBody] RegisterRequest request)
        {
            var user = _authService.Register(
                request.Username,
                request.Email,
                request.Password
            );

            return Ok(user);
        }
    }
}