namespace FileSharePlatform.Models
{
    public class UserFile
    {
        public int Id { get; set; }

        public string FileName { get; set; } = "";

        public string StoredFileName { get; set; } = "";

        public long Size { get; set; }

        public string ContentType { get; set; } = "";

        public DateTime UploadedAt { get; set; }

        public int UserId { get; set; }
    }
}