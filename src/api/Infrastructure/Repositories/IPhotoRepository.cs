using Api.Domain;

namespace Api.Infrastructure.Repositories;

public interface IPhotoRepository
{
    Task<IEnumerable<Photo>> GetAllAsync(Guid? projectId = null);
    Task<IEnumerable<Photo>> GetWallAsync();
    Task<Photo?> GetByIdAsync(Guid id);
    Task<Photo> CreateAsync(Photo photo);
    Task DeleteAsync(Guid id);
}
