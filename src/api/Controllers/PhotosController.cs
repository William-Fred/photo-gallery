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
    public async Task<IActionResult> GetAll([FromQuery] Guid? projectId)
    {
        var photos = await photoRepository.GetAllAsync(projectId);
        return Ok(photos);
    }

    [HttpGet("wall")]
    public async Task<IActionResult> GetWall()
    {
        var photos = await photoRepository.GetWallAsync();
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

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var photo = await photoRepository.GetByIdAsync(id);
        if (photo is null)
            return NotFound();

        await storageService.DeleteAsync(photo.StorageKey);
        await photoRepository.DeleteAsync(id);

        return NoContent();
    }

    [HttpPost]
    public async Task<IActionResult> Upload(IFormFile file, [FromForm] Guid? projectId)
    {
        var storageKey = await storageService.UploadAsync(file.OpenReadStream(), file.FileName, file.ContentType);

        var photo = new Photo
        {
            FileName = file.FileName,
            StorageKey = storageKey,
            ContentType = file.ContentType,
            FileSize = file.Length,
            UploadedAt = DateTime.UtcNow,
            ProjectId = projectId
        };

        var created = await photoRepository.CreateAsync(photo);
        return CreatedAtAction(nameof(GetAll), null, created);
    }
}
