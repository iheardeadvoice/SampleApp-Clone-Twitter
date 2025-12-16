using SampleApp.API.Entities;


namespace SampleApp.API.Interfaces;

public interface IMicropostRepository
{
    Micropost CreateMicropost(Micropost post);
    List<Micropost> GetMicroposts();
    Micropost DeleteMicropost(int id);
    Micropost FindMicropostById(int id);
    Micropost EditMicropost(Micropost editedMicropost, int id);
}