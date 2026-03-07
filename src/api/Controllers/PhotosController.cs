using Api.Domain;
using Api.Services;
using Api.Infrastructure.Repositories;
using Api.Infrastructure.Storage;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PhotosController(
    IPhotoRepository photoRepository,
    IStorageService storageService,
    WatermarkService watermarkService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var photos = await photoRepository.GetAllAsync();
        return Ok(photos);
    }

    [HttpGet("{id:guid}/file")]
    public async Task<IActionResult> GetFile(Guid id)
    {
        var photo = await photoRepository.GetByIdAsync(id);
        if (photo is null)
            return NotFound();

        try
        {
            var stream = await storageService.DownloadAsync(photo.StorageKey);
            var watermarked = await watermarkService.ApplyWatermarkAsync(stream);
            return File(watermarked, "image/jpeg");
        }
        catch
        {
            return NotFound();
        }
    }

    [HttpPost]
    public async Task<IActionResult> Upload(IFormFile file)
    {
        var storageKey = await storageService.UploadAsync(file.OpenReadStream(), file.FileName, file.ContentType);

        var photo = new Photo
        {
            FileName = file.FileName,
            StorageKey = storageKey,
            ContentType = file.ContentType,
            FileSize = file.Length,
            UploadedAt = DateTime.UtcNow
        };

        var created = await photoRepository.CreateAsync(photo);
        return CreatedAtAction(nameof(GetAll), null, created);
    }
}
