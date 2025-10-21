export class StorageDeleteError extends Error {
  failed: string[];

  constructor(message: string, failed: string[] = []) {
    super(message);

    Object.setPrototypeOf(this, StorageDeleteError.prototype);
    this.name = 'StorageDeleteError';
    this.failed = failed;
  }
}
