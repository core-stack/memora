export class VectorDeleteError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, VectorDeleteError.prototype);
    this.name = "VectorSearchError";
  }
}
