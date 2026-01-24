namespace IdleSdk.Core.Persistence;

public interface ISnapshotStore
{
    Task SaveSnapshotAsync(Snapshot snapshot, CancellationToken cancellationToken = default);
    Task<Snapshot?> GetSnapshotAsync(Guid snapshotId, CancellationToken cancellationToken = default);
    Task<Snapshot?> GetLatestSnapshotAsync(string profileId, CancellationToken cancellationToken = default);
}
