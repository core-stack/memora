import { Module } from "@nestjs/common";
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from '@/db/schema';
import { env } from '@/env';

import { DrizzleAsyncProvider } from "./drizzle.provider";
import { TxManager } from "@/generics/tx-manager";
import { DrizzleTxManager } from "./drizzle-tx-manager";

@Module({
  providers: [
    {
      provide: DrizzleAsyncProvider,
      inject: [],
      useFactory: async () => {
        const connectionString = env.DATABASE_URL;
        const pool = new Pool({ connectionString });

        return drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;
      },
    },
    {
      provide: TxManager,
      useClass: DrizzleTxManager
    }
  ],
  exports: [DrizzleAsyncProvider, TxManager],
})
export class DatabaseModule {}
