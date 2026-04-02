using FileSharePlatform.Models;
using Microsoft.EntityFrameworkCore;

namespace FileSharePlatform.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<UserFile> Files { get; set; }

        public DbSet<User> Users { get; set; }
    }
}