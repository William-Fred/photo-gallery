using Api.Infrastructure.Database;
using Api.Infrastructure.Repositories;
using Api.Infrastructure.Storage;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

var connectionString = builder.Configuration.GetConnectionString("Default")
    ?? throw new InvalidOperationException("Connection string 'Default' is not configured.");

builder.Services.AddScoped<IImageRepository>(_ => new ImageRepository(connectionString));
builder.Services.AddTransient<IStorageService, LocalStorageService>();

var app = builder.Build();

DbMigrator.Run(connectionString);

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.MapControllers();

app.Run();
