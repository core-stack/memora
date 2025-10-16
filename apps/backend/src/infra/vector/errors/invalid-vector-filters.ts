export class InvalidVectorFiltersError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "InvalidVectorFiltersError";
  }
}