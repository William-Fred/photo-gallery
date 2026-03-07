namespace Api.Domain;

public class Photo
{
    public Guid Id { get; init; }
    public string FileName { get; init; } = string.Empty;
    public string StorageKey { get; init; } = string.Empty;
    public string ContentType { get; init; } = string.Empty;
    public long FileSize { get; init; }
    public DateTime UploadedAt { get; init; }
    public Guid? ProjectId { get; init; }
}
