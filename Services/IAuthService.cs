using FileSharePlatform.Models;

namespace FileSharePlatform.Services
{
    public interface IAuthService
    {
        User Register(string username, string email, string password);

        User? Login(string email, string password);
    }
}