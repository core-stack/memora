
export class Batcher<T = any> {
  private batch: T[] = [];

  constructor(private callback: (data: T[]) => void | Promise<void>, private maxBatchSize: number = 100) { }

  append(data: T) {
    this.batch.push(data);
    if (this.batch.length >= this.maxBatchSize) {
      this.callback(this.batch);
      this.reset();
    }
  }

  done() {
    if (this.batch.length > 0) {
      this.callback(this.batch);
      this.reset();
    }
  }

  private reset() {
    this.batch = [];
  }
}
