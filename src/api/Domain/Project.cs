namespace Api.Domain;

public class Project
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public int? Year { get; init; }
    public string? Description { get; init; }
    public DateTime CreatedAt { get; init; }
}
