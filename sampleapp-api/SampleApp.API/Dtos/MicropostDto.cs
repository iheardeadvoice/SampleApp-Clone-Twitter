using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SampleApp.API.Dtos;

public record MicropostDto(string Content, int UserId);