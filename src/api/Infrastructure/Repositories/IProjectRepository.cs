using Api.Domain;

namespace Api.Infrastructure.Repositories;

public interface IProjectRepository
{
    Task<IEnumerable<Project>> GetAllAsync();
    Task<Project?> GetByIdAsync(Guid id);
    Task<Project> CreateAsync(Project project);
    Task DeleteAsync(Guid id);
}
