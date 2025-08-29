import { Module } from "@nestjs/common";

import { VectorDatabaseService } from "./vector-database.service";

@Module({
  providers: [VectorDatabaseService],
  exports: [VectorDatabaseService],
})
export class DatabaseModule {}
