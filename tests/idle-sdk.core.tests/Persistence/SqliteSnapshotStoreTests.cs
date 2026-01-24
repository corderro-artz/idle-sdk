using IdleSdk.Core.Persistence;
using Microsoft.Data.Sqlite;

namespace IdleSdk.Core.Tests.Persistence;

public class SqliteSnapshotStoreTests
{
    [Fact]
    public async Task SaveAndLoadSnapshot_RoundTrips()
    {
        var tempPath = Path.Combine(Path.GetTempPath(), $"idle-sdk-{Guid.NewGuid():N}.db");
        try
        {
            var store = new SqliteSnapshotStore($"Data Source={tempPath}");

            var snapshot = new Snapshot(
                new SnapshotMetadata(Guid.NewGuid(), "profile-1", "v1", DateTimeOffset.UtcNow),
                "{\"state\":\"ok\"}"
            );

            await store.SaveSnapshotAsync(snapshot);

            var loaded = await store.GetSnapshotAsync(snapshot.Metadata.SnapshotId);

            Assert.NotNull(loaded);
            Assert.Equal(snapshot.Metadata.SnapshotId, loaded!.Metadata.SnapshotId);
            Assert.Equal(snapshot.Metadata.ProfileId, loaded.Metadata.ProfileId);
            Assert.Equal(snapshot.Metadata.SchemaVersion, loaded.Metadata.SchemaVersion);
            Assert.Equal(snapshot.Payload, loaded.Payload);
        }
        finally
        {
            SqliteConnection.ClearAllPools();
            if (File.Exists(tempPath))
            {
                File.Delete(tempPath);
            }
        }
    }

    [Fact]
    public async Task GetLatestSnapshot_ReturnsMostRecent()
    {
        var tempPath = Path.Combine(Path.GetTempPath(), $"idle-sdk-{Guid.NewGuid():N}.db");
        try
        {
            var store = new SqliteSnapshotStore($"Data Source={tempPath}");

            var older = new Snapshot(
                new SnapshotMetadata(Guid.NewGuid(), "profile-2", "v1", DateTimeOffset.UtcNow.AddMinutes(-5)),
                "older"
            );
            var newer = new Snapshot(
                new SnapshotMetadata(Guid.NewGuid(), "profile-2", "v1", DateTimeOffset.UtcNow),
                "newer"
            );

            await store.SaveSnapshotAsync(older);
            await store.SaveSnapshotAsync(newer);

            var latest = await store.GetLatestSnapshotAsync("profile-2");

            Assert.NotNull(latest);
            Assert.Equal(newer.Metadata.SnapshotId, latest!.Metadata.SnapshotId);
            Assert.Equal("newer", latest.Payload);
        }
        finally
        {
            SqliteConnection.ClearAllPools();
            if (File.Exists(tempPath))
            {
                File.Delete(tempPath);
            }
        }
    }
}
