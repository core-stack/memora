export abstract class EmbeddingProvider {
  constructor() {
    Object.setPrototypeOf(this, EmbeddingProvider.prototype);
  }
  abstract embed(text: string): Promise<number[]>;
  abstract embed(texts: string[]): Promise<number[][]>;
}