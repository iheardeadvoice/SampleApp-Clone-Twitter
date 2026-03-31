using FluentValidation;
using SampleApp.API.Dtos;

namespace SampleApp.API.Validations;

public class MicropostValidator : AbstractValidator<MicropostDto>
{
    public MicropostValidator() =>
        RuleFor(m => m.Content)
            .NotEmpty()
            .WithMessage("Сообщение не может быть пустым")
            .Length(1, 140)
            .WithMessage("Сообщение должно быть от 2 до 140 символов");
}
