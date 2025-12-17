namespace SampleApp.API.Services;

public interface ITokenService
{
    string CreateToken(string userLogin);
}
