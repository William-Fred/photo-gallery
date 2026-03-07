using Api.Domain;
using Dapper;

namespace Api.Infrastructure.Repositories;

public class ProjectRepository(string connectionString) : IProjectRepository
{
    private const string SelectColumns = """
        SELECT
            id          AS "Id",
            name        AS "Name",
            year        AS "Year",
            description AS "Description",
            created_at  AS "CreatedAt"
        FROM projects
        """;

    public async Task<IEnumerable<Project>> GetAllAsync()
    {
        await using var conn = new Npgsql.NpgsqlConnection(connectionString);
        return await conn.QueryAsync<Project>($"{SelectColumns} ORDER BY year DESC, name");
    }

    public async Task<Project?> GetByIdAsync(Guid id)
    {
        await using var conn = new Npgsql.NpgsqlConnection(connectionString);
        return await conn.QuerySingleOrDefaultAsync<Project>($"{SelectColumns} WHERE id = @Id", new { Id = id });
    }

    public async Task<Project> CreateAsync(Project project)
    {
        const string sql = """
            INSERT INTO projects (name, year, description)
            VALUES (@Name, @Year, @Description)
            RETURNING
                id          AS "Id",
                name        AS "Name",
                year        AS "Year",
                description AS "Description",
                created_at  AS "CreatedAt"
            """;

        await using var conn = new Npgsql.NpgsqlConnection(connectionString);
        return await conn.QuerySingleAsync<Project>(sql, project);
    }

    public async Task DeleteAsync(Guid id)
    {
        await using var conn = new Npgsql.NpgsqlConnection(connectionString);
        await conn.ExecuteAsync("DELETE FROM projects WHERE id = @Id", new { Id = id });
    }
}
