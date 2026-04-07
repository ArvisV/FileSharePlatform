namespace FileSharePlatform.DTOs
{
    public class FileDto
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public long Size { get; set; }
        public DateTime UploadedAt { get; set; }

    }
}