import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { IngestModule } from "./modules/ingest/ingest.module";
import { SearchModule } from "./modules/search/search.module";
import { DatabaseModule } from "./services/database/database.module";

@Module({
  imports: [
    IngestModule,
    SearchModule,
    DatabaseModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
