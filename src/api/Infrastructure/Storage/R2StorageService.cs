using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;

namespace Api.Infrastructure.Storage;

public class R2StorageService : IStorageService
{
    private readonly AmazonS3Client _client;
    private readonly string _bucketName;

    public R2StorageService(string endpoint, string accessKeyId, string secretAccessKey, string bucketName)
    {
        var config = new AmazonS3Config
        {
            ServiceURL = endpoint,
            ForcePathStyle = true,
        };

        _client = new AmazonS3Client(new BasicAWSCredentials(accessKeyId, secretAccessKey), config);
        _bucketName = bucketName;
    }

    public async Task<string> UploadAsync(Stream fileStream, string fileName, string contentType)
    {
        var storageKey = $"{Guid.NewGuid()}_{fileName}";

        var request = new PutObjectRequest
        {
            BucketName = _bucketName,
            Key = storageKey,
            InputStream = fileStream,
            ContentType = contentType,
            UseChunkEncoding = false,
        };

        await _client.PutObjectAsync(request);

        return storageKey;
    }

    public async Task DeleteAsync(string storageKey)
    {
        var request = new DeleteObjectRequest
        {
            BucketName = _bucketName,
            Key = storageKey,
        };

        await _client.DeleteObjectAsync(request);
    }

    public async Task<Stream> DownloadAsync(string storageKey)
    {
        var request = new GetObjectRequest
        {
            BucketName = _bucketName,
            Key = storageKey,
        };

        var response = await _client.GetObjectAsync(request);
        return response.ResponseStream;
    }
}
