using Microsoft.AspNetCore.Mvc;
using FileSharePlatform.Services;
using FileSharePlatform.DTOs;

namespace FileSharePlatform.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest request)
        {
            var user = _authService.Register(
                request.Username,
                request.Email,
                request.Password
            );

            return Ok(user);
        }

        [HttpPost("login")]
        public IActionResult Login(LoginRequest request)
        {
            var token = _authService.Login(request.Email, request.Password);

            if (token == null)
                return Unauthorized("Invalid email or password");

            return Ok(new
            {
              token = token
            });
        }
    }
}