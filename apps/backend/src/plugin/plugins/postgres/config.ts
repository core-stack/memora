import { PluginConfigFieldType } from "@/plugin/base/config.interface";

import { IPlugin } from "../types";

export type PostgresPluginConfigType = {
  host: string,
  port: number,
  username: string,
  password: string,
  database: string
}

export const postgresPlugin: IPlugin<PostgresPluginConfigType> = {
  name: "Postgres",
  description: "Postgres",
  icon: "database",
  configSchema: {
    host: PluginConfigFieldType.STRING,
    port: PluginConfigFieldType.NUMBER,
    username: PluginConfigFieldType.STRING,
    password: PluginConfigFieldType.SECRET_STRING,
    database: PluginConfigFieldType.STRING
  }
}