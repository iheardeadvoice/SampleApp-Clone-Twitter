using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SampleApp.API.Entities
{
    public class Micropost : Base
    {
        public string Content { get; set; } = string.Empty;
        public User? User { get; set; }
        public int UserId { get; set; }
    }
}