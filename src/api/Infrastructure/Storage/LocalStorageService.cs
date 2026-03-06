namespace Api.Infrastructure.Storage;

public class LocalStorageService : IStorageService
{
    private const string UploadFolder = "uploads";

    public LocalStorageService()
    {
        Directory.CreateDirectory(UploadFolder);
    }

    public async Task<string> UploadAsync(Stream fileStream, string fileName, string contentType)
    {
        var storageKey = $"{Guid.NewGuid()}_{fileName}";
        var path = Path.Combine(UploadFolder, storageKey);

        await using var file = File.Create(path);
        await fileStream.CopyToAsync(file);

        return storageKey;
    }
    public Task DeleteAsync(string storageKey)
    {
        var path = Path.Combine(UploadFolder, storageKey);
        if (File.Exists(path))
            File.Delete(path);

        return Task.CompletedTask;
    }

    public Task<Stream> DownloadAsync(string storageKey)
    {
        throw new NotImplementedException();
    }
}