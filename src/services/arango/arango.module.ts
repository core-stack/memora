import { Module } from "@nestjs/common";

import { ArangoService } from "./arango.service";

@Module({
  providers: [ArangoService],
})
export class ArangoModule {}
