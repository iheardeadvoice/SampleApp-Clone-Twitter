using System.Linq;
using SampleApp.API.Data;
using SampleApp.API.Entities;
using SampleApp.API.Exceptions;
using SampleApp.API.Interfaces;

namespace SampleApp.API.Repositories;

public class MicropostRepository(SampleAppContext db) : IMicropostRepository
{
    public Micropost CreateMicropost(Micropost post)
    {
        db.Microposts.Add(post);
        db.SaveChanges();
        return post;
    }

    public Micropost FindMicropostById(int id)
    {
        var post = db.Microposts.Find(id);
        return post != null ? post : throw new NotFoundException($"Нет сообщения c id = {id}");
    }

    public Micropost DeleteMicropost(int id)
    {
        var post = FindMicropostById(id);
        db.Microposts.Remove(post);
        db.SaveChanges();
        return post;
    }

    public Micropost EditMicropost(Micropost editedMicropost, int id)
    {
        var post = FindMicropostById(id);
        post.Content = editedMicropost.Content;
        db.SaveChanges();
        return post;
    }

    public List<Micropost> GetMicroposts()
    {
        return db.Microposts.ToList();
    }
}