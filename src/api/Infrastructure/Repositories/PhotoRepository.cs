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
        uploaded_at  AS "UploadedAt",
        project_id   AS "ProjectId"
    FROM images
    """;

    public async Task<IEnumerable<Photo>> GetAllAsync(Guid? projectId = null)
    {
        await using var conn = new Npgsql.NpgsqlConnection(connectionString);
        var sql = projectId is null
            ? SelectColumns
            : $"{SelectColumns} WHERE project_id = @ProjectId";
        return await conn.QueryAsync<Photo>(sql, new { ProjectId = projectId });
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
            INSERT INTO images (file_name, storage_key, content_type, file_size, uploaded_at, project_id)
            VALUES (@FileName, @StorageKey, @ContentType, @FileSize, @UploadedAt, @ProjectId)
            RETURNING
                id           AS "Id",
                file_name    AS "FileName",
                storage_key  AS "StorageKey",
                content_type AS "ContentType",
                file_size    AS "FileSize",
                uploaded_at  AS "UploadedAt",
                project_id   AS "ProjectId"
            """;

        await using var conn = new Npgsql.NpgsqlConnection(connectionString);
        return await conn.QuerySingleAsync<Photo>(sql, photo);
    }

    public async Task<IEnumerable<Photo>> GetWallAsync()
    {
        await using var conn = new Npgsql.NpgsqlConnection(connectionString);
        return await conn.QueryAsync<Photo>($"{SelectColumns} WHERE project_id IS NULL");
    }

    public async Task DeleteAsync(Guid id)
    {
        await using var conn = new Npgsql.NpgsqlConnection(connectionString);
        await conn.ExecuteAsync("DELETE FROM images WHERE id = @Id", new { Id = id });
    }
}
