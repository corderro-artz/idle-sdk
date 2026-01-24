namespace IdleSdk.Core.Offline;

public sealed record OfflineReconcileRequest(Guid ProfileId, DateTimeOffset LastActiveAt, DateTimeOffset Now);
