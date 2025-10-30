export class NonUniqueError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NonUniqueError";
  }
}