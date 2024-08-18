// importing namespace
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

// current namespace
namespace API_BurgerMania.Models
{
    [Table("Users")]
    public class User
    {
        [Key]
        public Guid UserId { get; set; } // unique identifier for user (primary key)

        [Required]
        [MaxLength(25)]
        public string? UserName { get; set; } // username for the user

        public string PasswordHash { get; set; }
        public string Role { get; set; } // Admin or User
    }
}
