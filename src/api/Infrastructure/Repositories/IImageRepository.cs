using Api.Domain;

namespace Api.Infrastructure.Repositories;

public interface IImageRepository
{
    Task<IEnumerable<Image>> GetAllAsync();
    Task<Image?> GetByIdAsync(Guid id);
    Task<Image> CreateAsync(Image image);
}
