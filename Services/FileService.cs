using FileSharePlatform.Data;
using FileSharePlatform.Models;

namespace FileSharePlatform.Services
{
    public class FileService
    {
        private readonly AppDbContext _context;

        public FileService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<UserFile> SaveFileAsync(
            IFormFile file,
            int userId,
            string uploadsFolder)
        {
            var storedName = Guid.NewGuid() + "-" + file.FileName;

            var path = Path.Combine(uploadsFolder, storedName);

            using (var stream = new FileStream(path, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var fileEntity = new UserFile
            {
                FileName = file.FileName,
                StoredFileName = storedName,
                Size = file.Length,
                ContentType = file.ContentType,
                UploadedAt = DateTime.UtcNow,
                UserId = userId
            };

            _context.Files.Add(fileEntity);
            await _context.SaveChangesAsync();

            return fileEntity;
        }
    }
}