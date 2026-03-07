using Api.Domain;

namespace Api.Infrastructure.Repositories;

public interface IPhotoRepository
{
    Task<IEnumerable<Photo>> GetAllAsync();
    Task<Photo?> GetByIdAsync(Guid id);
    Task<Photo> CreateAsync(Photo photo);
}
