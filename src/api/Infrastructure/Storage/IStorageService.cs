namespace Api.Infrastructure.Storage;

public interface IStorageService
{
    Task<string> UploadAsync(Stream fileStream, string fileName, string contentType);
    Task<Stream> DownloadAsync(string storageKey);
    Task DeleteAsync(string storageKey);
}