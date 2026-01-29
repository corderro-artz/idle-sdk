using IdleSdk.Core.Data;
using IdleSdk.Core.Events;

namespace IdleSdk.Core.Tests.Data;

public class ContentPackManagerTests
{
    [Fact]
    public async Task LoadFromDirectory_Validates_Manifest_And_Data()
    {
        var root = CreateTempDirectory();
        var packDir = Path.Combine(root, "pack-a");
        Directory.CreateDirectory(Path.Combine(packDir, "data"));

        var manifest = """
        {
          "id": "pack-a",
          "name": "Pack A",
          "version": "1.0.0",
          "schemaVersion": "1.0",
          "dependencies": [],
          "modules": [],
          "enabledByDefault": true
        }
        """;

        var actions = """
        [
          { "id": "gather", "name": "Gather", "duration": 1, "cooldown": 0, "tags": ["basic"] }
        ]
        """;

        File.WriteAllText(Path.Combine(packDir, "pack.json"), manifest);
        File.WriteAllText(Path.Combine(packDir, "data", "actions.json"), actions);

        var registry = new ContentPackRegistry();
        var manifestValidator = await DataPackValidator.ForContentPackManifestAsync();
        var actionValidator = await DataPackValidator.FromSchemaJsonAsync(DataPackSchemas.ActionDataSchema);
        var manager = new ContentPackManager(registry, manifestValidator, new Dictionary<string, DataPackValidator>
        {
            ["actions"] = actionValidator
        }, new EventHub());

        var result = manager.LoadFromDirectory(packDir);

        Assert.True(result.IsValid);
        Assert.NotNull(result.Pack);
        Assert.Equal("pack-a", result.Pack!.Manifest.Id);
    }

    [Fact]
    public async Task LoadFromDirectory_Fails_On_Invalid_Manifest()
    {
        var root = CreateTempDirectory();
        var packDir = Path.Combine(root, "pack-b");
        Directory.CreateDirectory(packDir);

        File.WriteAllText(Path.Combine(packDir, "pack.json"), "{ \"name\": \"MissingId\" }");

        var registry = new ContentPackRegistry();
        var manifestValidator = await DataPackValidator.ForContentPackManifestAsync();
        var manager = new ContentPackManager(registry, manifestValidator);

        var result = manager.LoadFromDirectory(packDir);

        Assert.False(result.IsValid);
        Assert.NotEmpty(result.Errors);
    }

      [Fact]
      public async Task LoadFromDirectory_Fails_On_Invalid_Manifest_Json()
      {
        var root = CreateTempDirectory();
        var packDir = Path.Combine(root, "pack-invalid-json");
        Directory.CreateDirectory(packDir);

        File.WriteAllText(Path.Combine(packDir, "pack.json"), "{ invalid json }");

        var registry = new ContentPackRegistry();
        var manifestValidator = await DataPackValidator.ForContentPackManifestAsync();
        var manager = new ContentPackManager(registry, manifestValidator);

        var result = manager.LoadFromDirectory(packDir);

        Assert.False(result.IsValid);
        Assert.NotEmpty(result.Errors);
      }

      [Fact]
      public async Task LoadFromDirectory_Fails_On_Invalid_Data_Json()
      {
        var root = CreateTempDirectory();
        var packDir = Path.Combine(root, "pack-data-invalid");
        Directory.CreateDirectory(Path.Combine(packDir, "data"));

        File.WriteAllText(Path.Combine(packDir, "pack.json"), """
        {
          "id": "pack-data-invalid",
          "name": "Pack Data Invalid",
          "version": "1.0.0",
          "schemaVersion": "1.0",
          "enabledByDefault": true
        }
        """);
        File.WriteAllText(Path.Combine(packDir, "data", "actions.json"), "{ invalid json }");

        var registry = new ContentPackRegistry();
        var manifestValidator = await DataPackValidator.ForContentPackManifestAsync();
        var actionValidator = await DataPackValidator.FromSchemaJsonAsync(DataPackSchemas.ActionDataSchema);
        var manager = new ContentPackManager(registry, manifestValidator, new Dictionary<string, DataPackValidator>
        {
          ["actions"] = actionValidator
        });

        var result = manager.LoadFromDirectory(packDir);

        Assert.False(result.IsValid);
        Assert.NotEmpty(result.Errors);
      }

    [Fact]
    public async Task Registry_Snapshot_Roundtrip()
    {
        var registry = new ContentPackRegistry();
        var manifestValidator = await DataPackValidator.ForContentPackManifestAsync();
        var manager = new ContentPackManager(registry, manifestValidator);

        var root = CreateTempDirectory();
        var packDir = Path.Combine(root, "pack-c");
        Directory.CreateDirectory(packDir);
        File.WriteAllText(Path.Combine(packDir, "pack.json"), """
        {
          "id": "pack-c",
          "name": "Pack C",
          "version": "1.0.0",
          "schemaVersion": "1.0",
          "enabledByDefault": false
        }
        """);

        var result = manager.LoadFromDirectory(packDir);
        registry.Register(result.Pack!);
        manager.Enable("pack-c");

        var snapshot = registry.GetSnapshot();
        registry.Disable("pack-c");
        registry.RestoreSnapshot(snapshot);

        Assert.True(registry.Get("pack-c").Enabled);
    }

      [Fact]
      public async Task LoadAllFromRoot_Rejects_Invalid_Root()
      {
        var registry = new ContentPackRegistry();
        var manifestValidator = await DataPackValidator.ForContentPackManifestAsync();
        var manager = new ContentPackManager(registry, manifestValidator);

        Assert.Throws<ArgumentException>(() => manager.LoadAllFromRoot(" "));
        Assert.Throws<DirectoryNotFoundException>(() => manager.LoadAllFromRoot(Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString())));
      }

      [Fact]
      public async Task StartWatching_Rejects_Invalid_Root()
      {
        var registry = new ContentPackRegistry();
        var manifestValidator = await DataPackValidator.ForContentPackManifestAsync();
        var manager = new ContentPackManager(registry, manifestValidator);

        Assert.Throws<ArgumentException>(() => manager.StartWatching(" "));
        Assert.Throws<DirectoryNotFoundException>(() => manager.StartWatching(Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString())));
      }

      [Fact]
      public async Task StartWatching_Dedupes_And_StopWatching_Clears()
      {
        var root = CreateTempDirectory();
        var registry = new ContentPackRegistry();
        var manifestValidator = await DataPackValidator.ForContentPackManifestAsync();
        var manager = new ContentPackManager(registry, manifestValidator);

        manager.StartWatching(root);
        manager.StartWatching(root);
        manager.StopWatching();
        manager.StopWatching();
      }

      [Fact]
      public async Task TryReload_Removes_Pack_When_Manifest_Deleted()
      {
        var root = CreateTempDirectory();
        var packDir = Path.Combine(root, "pack-watch");
        Directory.CreateDirectory(packDir);

        File.WriteAllText(Path.Combine(packDir, "pack.json"), """
        {
          "id": "pack-watch",
          "name": "Pack Watch",
          "version": "1.0.0",
          "schemaVersion": "1.0",
          "enabledByDefault": true
        }
        """);

        var registry = new ContentPackRegistry();
        var manifestValidator = await DataPackValidator.ForContentPackManifestAsync();
        var manager = new ContentPackManager(registry, manifestValidator, events: new EventHub());

        var result = manager.LoadFromDirectory(packDir);
        registry.Register(result.Pack!);

        var manifestPath = Path.Combine(packDir, "pack.json");
        File.Delete(manifestPath);

        InvokeTryReload(manager, manifestPath, root);

        Assert.Throws<KeyNotFoundException>(() => registry.Get("pack-watch"));
      }

      [Fact]
      public async Task TryReload_Reports_Failure_On_Invalid_Pack()
      {
        var root = CreateTempDirectory();
        var packDir = Path.Combine(root, "pack-invalid");
        Directory.CreateDirectory(packDir);
        File.WriteAllText(Path.Combine(packDir, "pack.json"), "{ invalid json }");

        var hub = new EventHub();
        var registry = new ContentPackRegistry();
        var manifestValidator = await DataPackValidator.ForContentPackManifestAsync();
        var manager = new ContentPackManager(registry, manifestValidator, events: hub);

        ContentPackHotReloadFailed? failed = null;
        using var subscription = hub.Subscribe<ContentPackHotReloadFailed>(evt => failed = evt);

        InvokeTryReload(manager, Path.Combine(packDir, "pack.json"), root);

        Assert.NotNull(failed);
      }

      private static void InvokeTryReload(ContentPackManager manager, string changedPath, string rootDirectory)
      {
        var method = typeof(ContentPackManager).GetMethod("TryReload", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance);
        if (method is null)
        {
          throw new InvalidOperationException("TryReload method not found.");
        }

        method.Invoke(manager, new object[] { changedPath, rootDirectory });
      }

    private static string CreateTempDirectory()
    {
        var root = Path.Combine(Path.GetTempPath(), $"idle-sdk-{Guid.NewGuid()}");
        Directory.CreateDirectory(root);
        return root;
    }
}
