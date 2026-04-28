using FileSharePlatform.Data;
using FileSharePlatform.Models;
using Microsoft.AspNetCore.Identity;

namespace FileSharePlatform.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly PasswordHasher<User>_passwordHasher;

        private readonly TokenService _tokenService;

        public AuthService(AppDbContext context, TokenService tokenService)
        {
            _context = context;
            _passwordHasher = new PasswordHasher<User>();
            _tokenService = tokenService;
        }

        public User Register(string username, string email, string password)
        {
            if (_context.Users.Any(u => u.Email == email))
                throw new Exception("Email already exists");

            if (_context.Users.Any(u => u.Username == username))
                throw new Exception("Username already exists");
                
            var user = new User
            {
                Username = username,
                Email = email,
                CreatedAt = DateTime.UtcNow
            };

            user.PasswordHash = _passwordHasher.HashPassword(user, password);

            _context.Users.Add(user);
            _context.SaveChanges();

            return user;
        }

        public string? Login(string email, string password)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == email);

            if (user == null)
               return null;

            var result = _passwordHasher.VerifyHashedPassword(
                user,
                user.PasswordHash,
                password
            );

            if (result == PasswordVerificationResult.Failed)
                return null;
            
            var token = _tokenService.GenerateToken(user);

            return token;
        }
    }
}