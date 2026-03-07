using Api.Domain;
using Api.Infrastructure.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController(IProjectRepository projectRepository) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var projects = await projectRepository.GetAllAsync();
        return Ok(projects);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var project = await projectRepository.GetByIdAsync(id);
        return project is null ? NotFound() : Ok(project);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProjectRequest request)
    {
        var project = new Project
        {
            Name = request.Name,
            Year = request.Year,
            Description = request.Description
        };

        var created = await projectRepository.CreateAsync(project);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var project = await projectRepository.GetByIdAsync(id);
        if (project is null) return NotFound();

        await projectRepository.DeleteAsync(id);
        return NoContent();
    }
}

public record CreateProjectRequest(string Name, int? Year, string? Description);
