using FileSharePlatform.Models;

namespace FileSharePlatform.Services
{
    public interface IAuthService
    {
        User Register(string username, string email, string password);

        string? Login(string email, string password);
    }
}