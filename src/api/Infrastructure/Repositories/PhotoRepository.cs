using Api.Domain;
using Dapper;

namespace Api.Infrastructure.Repositories;

public class PhotoRepository(string connectionString) : IPhotoRepository
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

    public async Task<IEnumerable<Photo>> GetAllAsync()
    {
        await using var conn = new Npgsql.NpgsqlConnection(connectionString);
        return await conn.QueryAsync<Photo>(SelectColumns);
    }

    public async Task<Photo?> GetByIdAsync(Guid id)
    {
        await using var conn = new Npgsql.NpgsqlConnection(connectionString);
        var query = $"{SelectColumns} WHERE id = @Id";
        return await conn.QuerySingleOrDefaultAsync<Photo>(query, new { Id = id });
    }

    public async Task<Photo> CreateAsync(Photo photo)
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
        return await conn.QuerySingleAsync<Photo>(sql, photo);
    }
}
