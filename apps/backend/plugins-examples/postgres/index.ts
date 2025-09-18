import { Client } from "pg";

export type PluginContext<TConfig = any> = {
  provider: any;
  config: TConfig;
}

export async function initialize(ctx: PluginContext) {
  console.log("initialize", ctx);

  const postgres = new Client({
    host: ctx.config.host,
    port: ctx.config.port,
    user: ctx.config.user,
    password: ctx.config.password,
    database: ctx.config.database
  })

  await postgres.connect();
  return new PostgresPlugin(postgres);
}

export interface IPlugin<Input = any, Output = any> {
  execute(data: Input): Promise<Output> | Output;
  dispose?(): Promise<void> | void;
}

export class PostgresPlugin implements IPlugin {
  constructor(private client: Client) {}
  execute(data: any): Promise<any> | any {

  }

  async dispose(): Promise<void> {
    console.log(PostgresPlugin.name, "dispose");
    await this.client.end();
  }
}