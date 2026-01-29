using IdleSdk.Core.Data;

namespace IdleSdk.Core.Tests.Data;

public class ContentPackRegistryTests
{
    [Fact]
    public void Register_Rejects_Duplicate_Pack()
    {
        var registry = new ContentPackRegistry();
        var pack = CreatePack("pack-a", "root-a");

        registry.Register(pack);

        Assert.Throws<InvalidOperationException>(() => registry.Register(pack));
    }

    [Fact]
    public void Get_Throws_For_Missing_Pack()
    {
        var registry = new ContentPackRegistry();

        Assert.Throws<KeyNotFoundException>(() => registry.Get("missing"));
    }

    [Fact]
    public void Replace_Updates_Pack()
    {
        var registry = new ContentPackRegistry();
        var pack = CreatePack("pack-a", "root-a");
        registry.Register(pack);

        var replacement = CreatePack("pack-a", "root-b");
        registry.Replace(replacement);

        Assert.Equal("root-b", registry.Get("pack-a").RootPath);
    }

    [Fact]
    public void TryGetByRootPath_Finds_Pack()
    {
        var registry = new ContentPackRegistry();
        var pack = CreatePack("pack-a", "root-a");
        registry.Register(pack);

        var found = registry.TryGetByRootPath("root-a");

        Assert.NotNull(found);
        Assert.Equal("pack-a", found!.Manifest.Id);
    }

    private static ContentPackState CreatePack(string id, string rootPath)
    {
        var manifest = new ContentPackManifest(id, "Pack", "1.0.0", "1.0", Array.Empty<string>(), Array.Empty<string>(), true);
        return new ContentPackState(manifest, rootPath, new Dictionary<string, string>());
    }
}
