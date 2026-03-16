export class OfflineError extends Error {
  readonly isOffline = true;
  constructor() {
    super("目前離線");
    this.name = "OfflineError";
  }
}

export function isOfflineError(error: unknown): error is OfflineError {
  return (
    error instanceof OfflineError ||
    (error instanceof Error && "isOffline" in error && error.isOffline === true)
  );
}
