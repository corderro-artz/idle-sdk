namespace IdleSdk.Core.Persistence;

public sealed record Snapshot(
    SnapshotMetadata Metadata,
    string Payload
);
