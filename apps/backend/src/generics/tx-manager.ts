export abstract class TxManager<Tx = any> {
  abstract run<T>(fn: (tx: Tx) => Promise<T>): T | Promise<T>;
  abstract runOrCreate<T>(tx: Tx | undefined, fn: (tx: Tx) => Promise<T>): T | Promise<T>;
}