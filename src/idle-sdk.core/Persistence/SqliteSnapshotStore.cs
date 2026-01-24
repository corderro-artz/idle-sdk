using Microsoft.Data.Sqlite;

namespace IdleSdk.Core.Persistence;

public sealed class SqliteSnapshotStore : ISnapshotStore
{
    private readonly string _connectionString;

    public SqliteSnapshotStore(string connectionString)
    {
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new ArgumentException("Connection string must be provided.", nameof(connectionString));
        }

        _connectionString = connectionString;
        EnsureSchema();
    }

    public async Task SaveSnapshotAsync(Snapshot snapshot, CancellationToken cancellationToken = default)
    {
        if (snapshot is null)
        {
            throw new ArgumentNullException(nameof(snapshot));
        }

        await using var connection = CreateConnection();
        await connection.OpenAsync(cancellationToken);

        await using var command = connection.CreateCommand();
        command.CommandText = @"
INSERT INTO snapshots (snapshot_id, profile_id, schema_version, created_at, payload)
VALUES ($id, $profileId, $schemaVersion, $createdAt, $payload);
";
        command.Parameters.AddWithValue("$id", snapshot.Metadata.SnapshotId.ToString());
        command.Parameters.AddWithValue("$profileId", snapshot.Metadata.ProfileId);
        command.Parameters.AddWithValue("$schemaVersion", snapshot.Metadata.SchemaVersion);
        command.Parameters.AddWithValue("$createdAt", snapshot.Metadata.CreatedAt.ToString("O"));
        command.Parameters.AddWithValue("$payload", snapshot.Payload);

        await command.ExecuteNonQueryAsync(cancellationToken);
    }

    public async Task<Snapshot?> GetSnapshotAsync(Guid snapshotId, CancellationToken cancellationToken = default)
    {
        await using var connection = CreateConnection();
        await connection.OpenAsync(cancellationToken);

        await using var command = connection.CreateCommand();
        command.CommandText = @"
SELECT snapshot_id, profile_id, schema_version, created_at, payload
FROM snapshots
WHERE snapshot_id = $id;
";
        command.Parameters.AddWithValue("$id", snapshotId.ToString());

        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        if (!await reader.ReadAsync(cancellationToken))
        {
            return null;
        }

        return MapSnapshot(reader);
    }

    public async Task<Snapshot?> GetLatestSnapshotAsync(string profileId, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(profileId))
        {
            throw new ArgumentException("Profile id must be provided.", nameof(profileId));
        }

        await using var connection = CreateConnection();
        await connection.OpenAsync(cancellationToken);

        await using var command = connection.CreateCommand();
        command.CommandText = @"
SELECT snapshot_id, profile_id, schema_version, created_at, payload
FROM snapshots
WHERE profile_id = $profileId
ORDER BY created_at DESC
LIMIT 1;
";
        command.Parameters.AddWithValue("$profileId", profileId);

        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        if (!await reader.ReadAsync(cancellationToken))
        {
            return null;
        }

        return MapSnapshot(reader);
    }

    private void EnsureSchema()
    {
        using var connection = CreateConnection();
        connection.Open();

        using var command = connection.CreateCommand();
        command.CommandText = @"
CREATE TABLE IF NOT EXISTS snapshots (
    snapshot_id TEXT PRIMARY KEY,
    profile_id TEXT NOT NULL,
    schema_version TEXT NOT NULL,
    created_at TEXT NOT NULL,
    payload TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_snapshots_profile ON snapshots (profile_id, created_at DESC);
";
        command.ExecuteNonQuery();
    }

    private SqliteConnection CreateConnection() => new(_connectionString);

    private static Snapshot MapSnapshot(SqliteDataReader reader)
    {
        var snapshotId = Guid.Parse(reader.GetString(0));
        var profileId = reader.GetString(1);
        var schemaVersion = reader.GetString(2);
        var createdAt = DateTimeOffset.Parse(reader.GetString(3));
        var payload = reader.GetString(4);

        return new Snapshot(new SnapshotMetadata(snapshotId, profileId, schemaVersion, createdAt), payload);
    }
}
