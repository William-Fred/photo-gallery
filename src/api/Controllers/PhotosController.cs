using Api.Domain;
using Api.Services;
using Api.Infrastructure.Repositories;
using Api.Infrastructure.Storage;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PhotosController(
    IPhotoRepository photoRepository,
    IStorageService storageService,
    WatermarkService watermarkService,
    IMemoryCache cache) : ControllerBase
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
        var cacheKey = $"photo:{id}";

        if (!cache.TryGetValue(cacheKey, out byte[]? imageBytes))
        {
            var photo = await photoRepository.GetByIdAsync(id);
            if (photo is null)
            {
                return NotFound();
            }

            try
            {
                var stream = await storageService.DownloadAsync(photo.StorageKey);
                var ms = new MemoryStream();
                await stream.CopyToAsync(ms);
                imageBytes = ms.ToArray();

                cache.Set(cacheKey, imageBytes, new MemoryCacheEntryOptions
                {
                    SlidingExpiration = TimeSpan.FromHours(1),
                    Size = imageBytes.Length,
                });
            }
            catch
            {
                return NotFound();
            }
        }

        Response.Headers.CacheControl = "public, max-age=3600";
        return File(imageBytes!, "image/jpeg");
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var photo = await photoRepository.GetByIdAsync(id);
        if (photo is null)
        {
            return NotFound();
        }

        await storageService.DeleteAsync(photo.StorageKey);
        await photoRepository.DeleteAsync(id);

        return NoContent();
    }

    [HttpPost]
    public async Task<IActionResult> Upload(IFormFile file, [FromForm] Guid? projectId)
    {
        var watermarkedPhoto = await watermarkService.ApplyWatermarkAsync(file.OpenReadStream());
        var storageKey = await storageService.UploadAsync(watermarkedPhoto, file.FileName, file.ContentType);

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
