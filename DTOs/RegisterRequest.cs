using Microsoft.AspNetCore.Mvc;
using FileSharePlatform.Services;
using FileSharePlatform.Models;

namespace FileSharePlatform.DTOs
{
    public class RegisterRequest
    {
        public string Username { get; set; } = "";

        public string Email { get; set; } = "";

        public string Password { get; set; } = "";
    }
}