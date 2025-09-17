import { Client } from "pg";

import { PluginConfigFieldType } from "../base/config.interface";
import { PluginInstance } from "../base/plugin";

export type PostgresPluginConfigType = {
  host: string,
  port: number,
  username: string,
  password: string,
  database: string
}
export class PostgresPlugin extends PluginInstance<PostgresPluginConfigType> {
  configSchema = {
    host: PluginConfigFieldType.STRING,
    port: PluginConfigFieldType.NUMBER,
    username: PluginConfigFieldType.STRING,
    password: PluginConfigFieldType.SECRET_STRING,
    database: PluginConfigFieldType.STRING
  };

  private client: Client;

  async test(config: PostgresPluginConfigType): Promise<boolean> {
    const test = await super.test(config);
    if (!test) return false;
    try {
      await this.load(config);
      const msg = "Hello world!";
      const res = await this.client.query('SELECT $1::text as message', [msg])
      await this.unload();

      return res.rows[0].message === msg;
    } catch (error) {
      return false;
    }
  }

  async load(config: PostgresPluginConfigType): Promise<void> {
    this.client = new Client({
      host: config.host,
      port: config.port,
      user: config.username,
      password: config.password,
      database: config.database
    });

    await this.client.connect();
  }

  async unload(): Promise<void> {
    await this.client.end();
  }

  async run(): Promise<void> {

  }
}