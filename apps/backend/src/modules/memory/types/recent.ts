export class RecentMemory {
  text: string;
  count: number;
  lastUsed: Date;

  constructor(text: string, count: number, lastUsed: Date) {
    this.text = text;
    this.count = count;
    this.lastUsed = lastUsed;
  }
}