import { TxManagerService } from "@/generics/tx-manager";
import { Inject } from "@nestjs/common";
import { DrizzleAsyncProvider } from "./drizzle.provider";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from '@/db/schema';
import { TxType } from "./types";

export class DrizzleTxManager extends TxManagerService<TxType> {
  @Inject(DrizzleAsyncProvider) protected readonly db: NodePgDatabase<typeof schema>;

  constructor() {
    super();
  }

  run<T>(fn: (tx: TxType) => Promise<T>): Promise<T> {
    return this.db.transaction(fn);
  }
}