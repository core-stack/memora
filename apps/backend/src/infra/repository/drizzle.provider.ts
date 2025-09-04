import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from '@/db/schema';
import { env } from '@/env';

export const DrizzleAsyncProvider = 'DrizzleAsyncProvider';

export const drizzleProvider = [
  {
    provide: DrizzleAsyncProvider,
    inject: [],
    useFactory: async () => {
      const connectionString = env.DATABASE_URL;
      const pool = new Pool({ connectionString });

      return drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;
    },
  },
];

