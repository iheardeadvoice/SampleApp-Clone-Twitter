using Microsoft.AspNetCore.Mvc;
using SampleApp.API.Entities;
using SampleApp.API.Interfaces;
using SampleApp.API.Validations;
using System.Linq;

namespace SampleApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _repo;

        public UsersController(IUserRepository repo)
        {
            _repo = repo;
        }

        // Задание 3: статус-код 201
        [HttpPost]
        public ActionResult CreateUser(User user)
        {
            var validator = new UserValidator();
            var result = validator.Validate(user);

            if (!result.IsValid)
            {
                // вместо throw — BadRequest, как в методичке для 201
                return BadRequest(result.Errors.First().ErrorMessage);
            }

            var createdUser = _repo.CreateUser(user);
            return CreatedAtAction(nameof(GetUserById), new { id = createdUser.Id }, createdUser);
        }

        [HttpGet]
        public ActionResult GetUsers()
        {
            return Ok(_repo.GetUsers());
        }

        [HttpPut]
        public ActionResult UpdateUser(User user)
        {
            return Ok(_repo.EditUser(user, user.Id));
        }

        [HttpGet("{id}")]
        public ActionResult GetUserById(int id)
        {
            return Ok(_repo.FindUserById(id));
        }

        [HttpDelete("{id}")]
        public ActionResult DeleteUser(int id)
        {
            return Ok(_repo.DeleteUser(id));
        }
    }
}
