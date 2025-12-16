using FluentValidation;
using FluentValidation.AspNetCore;

namespace SampleApp.API.Extensions;

public static class FluentValidationServices
{
    public static IServiceCollection AddFluentValidationServices(this IServiceCollection services)
    {
        ValidatorOptions.Global.DefaultClassLevelCascadeMode = CascadeMode.Continue;
        ValidatorOptions.Global.DefaultRuleLevelCascadeMode = CascadeMode.Stop;

        services.AddValidatorsFromAssemblyContaining<Program>();
        services.AddFluentValidationAutoValidation();

        return services;
    }
}
