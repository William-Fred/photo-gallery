using Api.Configuration;
using Api.Infrastructure.Database;
using Api.Infrastructure.Repositories;
using Api.Infrastructure.Storage;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddTransient<Api.Services.WatermarkService>();
builder.Services.AddMemoryCache(opts => opts.SizeLimit = 500 * 1024 * 1024); // 500 MB
builder.Services.AddOpenApi();

builder.Services.AddOptions<PhotoGalleryOptions>()
    .BindConfiguration(string.Empty)
    .ValidateDataAnnotations()
    .ValidateOnStart();

var connectionString = builder.Configuration.GetConnectionString("Default")
    ?? throw new InvalidOperationException("Connection string 'Default' is not configured.");

builder.Services.AddScoped<IPhotoRepository>(_ => new PhotoRepository(connectionString));
builder.Services.AddScoped<IProjectRepository>(_ => new ProjectRepository(connectionString));
builder.Services.AddTransient<IStorageService, R2StorageService>();

var app = builder.Build();

if (builder.Configuration.GetValue("RunDbMigrations", defaultValue: false))
    DbMigrator.Run(connectionString);

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.MapControllers();

app.Run();
