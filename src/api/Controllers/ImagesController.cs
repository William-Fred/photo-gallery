using Api.Infrastructure.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ImagesController(IImageRepository imageRepository) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var images = await imageRepository.GetAllAsync();
        return Ok(images);
    }

    [HttpPost]
    public IActionResult Upload()
    {
        return StatusCode(StatusCodes.Status501NotImplemented);
    }
}
