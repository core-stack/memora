import path from "path";
import { DataSource } from "typeorm";

import { env } from "./env";
import { __root } from "./root";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: env.DATABASE_URL,
  entities: [ path.join(__root, "**/entities/*.entity.ts") ],
  migrations: [ path.join(__root, "migrations/*.{ts,js}") ]
});
