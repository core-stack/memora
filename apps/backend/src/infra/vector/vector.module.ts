import { Module } from "@nestjs/common";

import { ArangoService } from "./arango";
import { VectorDatabaseService } from "./vector-database.service";

@Module({
  providers: [{ provide: VectorDatabaseService, useClass: ArangoService }],
  exports: [VectorDatabaseService],
})
export class VectorModule {}
