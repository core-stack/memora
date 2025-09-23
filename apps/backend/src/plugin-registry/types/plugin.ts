export interface IPlugin<Input = any, Output = any> {
  execute(data: Input): Promise<Output> | Output;
  test(): Promise<boolean>;
  dispose?(): Promise<void> | void;
}