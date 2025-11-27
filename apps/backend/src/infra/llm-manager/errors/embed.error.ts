export class EmbedError extends Error {
  constructor(message: string, errorOpts?: ErrorOptions) {
    super(message, errorOpts);
    this.name = "EmbeddingError";
  }
}
