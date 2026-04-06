using Microsoft.AspNetCore.Mvc;
using FileSharePlatform.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

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
    }
}