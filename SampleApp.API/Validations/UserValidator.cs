using FluentValidation;
using SampleApp.API.Dtos;

namespace SampleApp.API.Validations;

public class UserValidator : AbstractValidator<LoginDto>
{
    public UserValidator()
    {
        RuleFor(u => u.Login)
            .NotEmpty().WithMessage("Логин не должен быть пустым")
            .Length(2, 50).WithMessage("Длина логина должно быть от 2 до 50 символов")
            .Must(StartsWithCapitalLetter).WithMessage("Логин должен начинаться с заглавной буквы");
    }

    private static bool StartsWithCapitalLetter(string login)
        => !string.IsNullOrEmpty(login) && char.IsUpper(login[0]);
}
