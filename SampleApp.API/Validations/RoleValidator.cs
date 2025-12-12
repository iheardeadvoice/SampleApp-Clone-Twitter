using FluentValidation;
using SampleApp.API.Entities;

namespace SampleApp.API.Validations
{
    public class RoleValidator : AbstractValidator<Role>
    {
        public RoleValidator()
        {
            RuleFor(r => r.Name)
                .NotEmpty().WithMessage("Название роли обязательно")
                .Length(2, 50).WithMessage("Название роли должно быть от 2 до 50 символов");
        }
    }
}