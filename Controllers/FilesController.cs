using Microsoft.AspNetCore.Mvc;
using FileSharePlatform.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using FileSharePlatform.DTOs;

namespace FileSharePlatform.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FilesController : ControllerBase
    {
        private readonly FileService _fileService;

        public FilesController(FileService fileService)
        {
            _fileService = fileService;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("File is empty.");

            // File size 50MB
            long maxFileSize = 50 * 1024 * 1024;

            if (file.Length > maxFileSize)
                return BadRequest("File size exceeds 50MB limit");

            // File extensions
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".pdf", ".txt", ".doc", ".docx" };

            var extension = Path.GetExtension(file.FileName).ToLower();

            if (!allowedExtensions.Contains(extension))
                return BadRequest("File type not allowed");

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaim == null)
                return Unauthorized();

            int userId = int.Parse(userIdClaim);

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploads");

            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var result = await _fileService.SaveFileAsync(file, userId, uploadsFolder);

            return Ok(result);
        }

        [HttpGet]
        public IActionResult GetUserFiles()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaim == null)
                return Unauthorized();

            int userId = int.Parse(userIdClaim);

            var files = _fileService.GetUserFiles(userId);

            var result = files.Select(file => new FileDto
            {
                Id = file.Id,
                FileName = file.FileName,
                Size = file.Size,
                UploadedAt = file.UploadedAt
            });

            return Ok(result);
        }

        [HttpGet("{id}/download")]
        public IActionResult DownloadFile(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaim == null)
                return Unauthorized();

            int userId = int.Parse(userIdClaim);

            var file = _fileService.GetFileById(id);

            if (file == null)
                return NotFound();

            if (file.UserId != userId)
                return Forbid();

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
            var filePath = Path.Combine(uploadsFolder, file.StoredFileName);

            if (!System.IO.File.Exists(filePath))
                return NotFound("File not found on server");

            var bytes = System.IO.File.ReadAllBytes(filePath);

            return File(bytes, file.ContentType, file.FileName);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteFile(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaim == null)
                return Unauthorized();

            int userId = int.Parse(userIdClaim);

            var file = _fileService.GetFileById(id);

            if (file == null)
                return NotFound();

            if (file.UserId != userId)
                return Forbid();

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
            var filePath = Path.Combine(uploadsFolder, file.StoredFileName);

            if (System.IO.File.Exists(filePath))
                System.IO.File.Delete(filePath);

            _fileService.DeleteFile(file);

            return Ok(new { message = "File deleted successfully" });
        }

        // 🔗 SHARE LINK GENERATION
        [HttpPost("{id}/share")]
        public IActionResult ShareFile(int id)
        {
            var file = _fileService.GetFileById(id);

            if (file == null)
                return NotFound();

            if (string.IsNullOrEmpty(file.ShareToken))
            {
                file.ShareToken = Guid.NewGuid().ToString();
                _fileService.UpdateFile(file); // 👈 vajadzēs šo metodi servisā
            }

            var url = $"{Request.Scheme}://{Request.Host}/api/files/share/{file.ShareToken}";

            return Ok(new { url });
        }

        // 🌍 PUBLIC DOWNLOAD (NO AUTH)
        [AllowAnonymous]
        [HttpGet("share/{token}")]
        public IActionResult DownloadSharedFile(string token)
        {
            var file = _fileService.GetFileByShareToken(token);

            if (file == null)
                return NotFound();

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
            var filePath = Path.Combine(uploadsFolder, file.StoredFileName);

            if (!System.IO.File.Exists(filePath))
                return NotFound();

            var bytes = System.IO.File.ReadAllBytes(filePath);

            return File(bytes, file.ContentType, file.FileName);
        }
    }
}