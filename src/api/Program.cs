using Api.Infrastructure.Database;
using Api.Infrastructure.Repositories;
using Api.Infrastructure.Storage;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddTransient<Api.Infrastructure.Image.WatermarkService>();
builder.Services.AddOpenApi();

var connectionString = builder.Configuration.GetConnectionString("Default")
    ?? throw new InvalidOperationException("Connection string 'Default' is not configured.");

builder.Services.AddScoped<IImageRepository>(_ => new ImageRepository(connectionString));

var r2Endpoint = Environment.GetEnvironmentVariable("R2_ENDPOINT")
    ?? throw new InvalidOperationException("R2_ENDPOINT is not configured.");
var r2AccessKeyId = Environment.GetEnvironmentVariable("R2_ACCESS_KEY_ID")
    ?? throw new InvalidOperationException("R2_ACCESS_KEY_ID is not configured.");
var r2SecretAccessKey = Environment.GetEnvironmentVariable("R2_SECRET_ACCESS_KEY")
    ?? throw new InvalidOperationException("R2_SECRET_ACCESS_KEY is not configured.");
var r2BucketName = Environment.GetEnvironmentVariable("R2_BUCKET_NAME")
    ?? throw new InvalidOperationException("R2_BUCKET_NAME is not configured.");

builder.Services.AddTransient<IStorageService>(_ =>
    new R2StorageService(r2Endpoint, r2AccessKeyId, r2SecretAccessKey, r2BucketName));

var app = builder.Build();

DbMigrator.Run(connectionString);

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.MapControllers();

app.Run();
