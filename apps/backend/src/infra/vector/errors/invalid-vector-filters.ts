export class InvalidVectorFiltersError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, InvalidVectorFiltersError.prototype);
    this.name = "InvalidVectorFiltersError";
  }
}
