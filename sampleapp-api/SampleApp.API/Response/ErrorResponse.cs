namespace SampleApp.API.Response;

public class ErrorResponse
{
    public ErrorResponse(string statusCode, string? message = "", string? detail = "")
    {
        StatusCode = statusCode;
        Message = message;
        Detail = detail;
    }

    public string StatusCode { get; set; } = string.Empty;
    public string? Message { get; set; } = string.Empty;
    public string? Detail { get; set; } = string.Empty;
}
