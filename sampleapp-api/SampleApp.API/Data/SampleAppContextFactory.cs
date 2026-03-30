using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace SampleApp.API.Data;

public class SampleAppContextFactory : IDesignTimeDbContextFactory<SampleAppContext>
{
    public SampleAppContext CreateDbContext(string[] args)
    {
        var config = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false)
            .AddJsonFile("appsettings.Development.json", optional: true)
            .AddEnvironmentVariables()
            .Build();

        var cs = config["ConnectionStrings:PostgreSQL"];
        if (string.IsNullOrWhiteSpace(cs))
            throw new InvalidOperationException("ConnectionStrings:PostgreSQL пустая. Проверь appsettings.json");

        var options = new DbContextOptionsBuilder<SampleAppContext>()
            .UseNpgsql(cs)
            .Options;

        return new SampleAppContext(options);
    }
}
