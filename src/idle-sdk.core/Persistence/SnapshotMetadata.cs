namespace IdleSdk.Core.Persistence;

public sealed record SnapshotMetadata(
    Guid SnapshotId,
    string ProfileId,
    string SchemaVersion,
    DateTimeOffset CreatedAt
);
