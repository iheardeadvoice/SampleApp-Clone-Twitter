using System.Text.Json;
using System.Text.Json.Serialization;

namespace SampleApp.API.Extensions
{
    public static class ControllerServices
    {
        public static IServiceCollection AddControllerServices(this IServiceCollection services)
        {
            services
                .AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
                    options.JsonSerializerOptions.WriteIndented = true;
                    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                });

            return services;
        }
    }
}