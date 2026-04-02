using Microsoft.AspNetCore.Http;

namespace FileSharePlatform.DTOs
{
    public class UploadFileRequest
    {
        public IFormFile File { get; set; } = null!;
    }
}