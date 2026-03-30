using System.Net;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using SampleApp.API.Exceptions;
using SampleApp.API.Response;

namespace SampleApp.API.Middlewares;

public class ExceptionHandlerMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlerMiddleware> _logger;
    private readonly IHostEnvironment _env;

    public ExceptionHandlerMiddleware(
        RequestDelegate next,
        ILogger<ExceptionHandlerMiddleware> logger,
        IHostEnvironment env)
    {
        _next = next;
        _logger = logger;
        _env = env;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogWarning("Возникла ошибка...");
            _logger.LogError(ex, ex.Message);
            await ConvertExceptionAsync(context, ex);
        }
    }

    private Task ConvertExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        var httpStatusCode = HttpStatusCode.InternalServerError;
        var message = string.Empty;
        var detail = string.Empty;

        switch (exception)
        {
            case DbUpdateException dbUpdateEx:
                if (dbUpdateEx.InnerException is PostgresException pgEx)
                {
                    httpStatusCode = HttpStatusCode.BadRequest;

                    // Пример: уникальность Login (23505) / FK (23503)
                    message = pgEx.SqlState switch
                    {
                        "23505" => "Дубликат значения. Скорее всего логин уже существует.",
                        "23503" => "Нарушение внешнего ключа. Связанная запись не существует.",
                        _ => "Ошибка базы данных"
                    };

                    detail = pgEx.Message;
                    break;
                }

                httpStatusCode = HttpStatusCode.BadRequest;
                message = "Ошибка при сохранении данных";
                detail = dbUpdateEx.Message;
                break;

            case BadHttpRequestException badReq:
                httpStatusCode = HttpStatusCode.BadRequest;
                message = badReq.Message;
                detail = badReq.StackTrace ?? string.Empty;
                break;

            case NotFoundException nf:
                httpStatusCode = HttpStatusCode.NotFound;
                message = nf.Message;
                detail = nf.StackTrace ?? string.Empty;
                break;

            default:
                httpStatusCode = HttpStatusCode.InternalServerError;
                message = exception.Message;
                detail = exception.StackTrace ?? string.Empty;
                break;
        }

        context.Response.StatusCode = (int)httpStatusCode;

        var response = _env.IsDevelopment()
            ? new ErrorResponse(context.Response.StatusCode.ToString(), message, detail)
            : new ErrorResponse(context.Response.StatusCode.ToString(), "Internal Server Error");

        var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        var json = JsonSerializer.Serialize(response, options);

        return context.Response.WriteAsync(json);
    }
}
