export interface IPlugin<Input = any, Output = any> {
  execute(data: Input): Promise<Output> | Output;
  dispose?(): Promise<void> | void;
}