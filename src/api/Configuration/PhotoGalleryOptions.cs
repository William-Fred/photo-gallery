using System.ComponentModel.DataAnnotations;

namespace Api.Configuration;

public class PhotoGalleryOptions
{
    public R2Options R2 { get; init; } = new();
}

public class R2Options
{
    [Required]
    public string Endpoint { get; init; } = string.Empty;

    [Required]
    public string AccessKeyId { get; init; } = string.Empty;

    [Required]
    public string SecretAccessKey { get; init; } = string.Empty;

    [Required]
    public string BucketName { get; init; } = string.Empty;
}
