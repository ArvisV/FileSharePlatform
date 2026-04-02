using FileSharePlatform.Data;
using FileSharePlatform.Models;
using Microsoft.AspNetCore.Identity;

namespace FileSharePlatform.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly PasswordHasher<User>_passwordHasher;

        public AuthService(AppDbContext context)
        {
            _context = context;
            _passwordHasher = new PasswordHasher<User>();
        }

        public User Register(string username, string email, string password)
        {
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

        public User? Login(string email, string password)
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

            return user;
        }
    }
}