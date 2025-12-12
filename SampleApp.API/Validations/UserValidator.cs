using FluentValidation;
using SampleApp.API.Entities;

namespace SampleApp.API.Validations
{
    public class UserValidator : AbstractValidator<User>
    {
        public UserValidator()
        {
            RuleFor(u => u.Name)
                .NotEmpty().WithMessage("Имя обязательно")
                .Length(2, 50).WithMessage("Имя должно быть от 2 до 50 символов")
                .Must(StartsWithCapitalLetter).WithMessage("Имя должно начинаться с заглавной буквы");
            
            RuleFor(u => u.Id)
                .GreaterThan(0).WithMessage("ID должен быть положительным числом");
        }

        private bool StartsWithCapitalLetter(string name)
        {
            if (string.IsNullOrEmpty(name)) return false;
            return char.IsUpper(name[0]);
        }
    }
}