import { Module } from "@nestjs/common";

import { DrizzleAsyncProvider, drizzleProvider } from "./drizzle.provider";
import { TxManager } from "@/generics/tx-manager";
import { DrizzleTxManager } from "./drizzle-tx-manager";

@Module({
  providers: [
    ...drizzleProvider,
    {
      provide: TxManager,
      useClass: DrizzleTxManager
    }
  ],
  exports: [DrizzleAsyncProvider],
})
export class DatabaseModule {}
