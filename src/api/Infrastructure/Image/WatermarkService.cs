using SixLabors.Fonts;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Drawing.Processing;
using SixLabors.ImageSharp.Processing;

namespace Api.Infrastructure.Image;

public class WatermarkService
{
    private const string WatermarkText = "© w_analoga";

    public async Task<Stream> ApplyWatermarkAsync(Stream imageStream)
    {
        using var image = await SixLabors.ImageSharp.Image.LoadAsync(imageStream);

        var fontFamily = SystemFonts.Collection.Families.First();
        var fontSize = Math.Max(image.Width / 50f, 12f);
        var font = fontFamily.CreateFont(fontSize, FontStyle.Regular);

        var padding = 20;
        var textOptions = new RichTextOptions(font)
        {
            HorizontalAlignment = HorizontalAlignment.Right,
            VerticalAlignment = VerticalAlignment.Bottom,
            Origin = new System.Numerics.Vector2(image.Width - padding, image.Height - padding),
        };

        image.Mutate(ctx =>
        {
            ctx.DrawText(textOptions, WatermarkText, Color.FromRgba(255, 255, 255, 160));
        });

        var output = new MemoryStream();
        await image.SaveAsJpegAsync(output);
        output.Position = 0;
        return output;
    }
}
