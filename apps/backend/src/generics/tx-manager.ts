export abstract class TxManagerService<Tx = any> {
  abstract run<T>(fn: (tx: Tx) => Promise<T>): T | Promise<T>;
}