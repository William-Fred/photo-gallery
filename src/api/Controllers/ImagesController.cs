using Api.Domain;
using Api.Infrastructure.Repositories;
using Api.Infrastructure.Storage;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ImagesController(IImageRepository imageRepository, IStorageService storageService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var images = await imageRepository.GetAllAsync();
        return Ok(images);
    }

    [HttpPost]
    public async Task<IActionResult> Upload(IFormFile file)
    {
        var storageKey = await storageService.UploadAsync(file.OpenReadStream(), file.FileName, file.ContentType);

        var image = new Image
        {
            FileName = file.FileName,
            StorageKey = storageKey,
            ContentType = file.ContentType,
            FileSize = file.Length,
            UploadedAt = DateTime.UtcNow
        };

        var created = await imageRepository.CreateAsync(image);
        return CreatedAtAction(nameof(GetAll), null, created);
    }
}
