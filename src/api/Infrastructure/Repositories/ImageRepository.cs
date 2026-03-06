using Api.Domain;
using Dapper;

namespace Api.Infrastructure.Repositories;

public class ImageRepository(string connectionString) : IImageRepository
{
    private const string SelectColumns = """
      SELECT
        id           AS "Id",
        file_name    AS "FileName",
        storage_key  AS "StorageKey",
        content_type AS "ContentType",
        file_size    AS "FileSize",
        uploaded_at  AS "UploadedAt"
    FROM images
    """;
    public async Task<IEnumerable<Image>> GetAllAsync()
    {
        await using var conn = new Npgsql.NpgsqlConnection(connectionString);
        return await conn.QueryAsync<Image>(SelectColumns);
    }

    public async Task<Image?> GetByIdAsync(Guid id)
    {
        await using var conn = new Npgsql.NpgsqlConnection(connectionString);
        var query = $"{SelectColumns} WHERE id = @Id";
        return await conn.QuerySingleOrDefaultAsync<Image>(query, new { Id = id });
    }

    public async Task<Image> CreateAsync(Image image)
    {
        const string sql = """
            INSERT INTO images (file_name, storage_key, content_type, file_size, uploaded_at)
            VALUES (@FileName, @StorageKey, @ContentType, @FileSize, @UploadedAt)
            RETURNING
                id           AS "Id",
                file_name    AS "FileName",
                storage_key  AS "StorageKey",
                content_type AS "ContentType",
                file_size    AS "FileSize",
                uploaded_at  AS "UploadedAt"
            """;

        await using var conn = new Npgsql.NpgsqlConnection(connectionString);
        return await conn.QuerySingleAsync<Image>(sql, image);
    }
}
