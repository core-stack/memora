export class VectorSearchError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "VectorSearchError";
  }
}