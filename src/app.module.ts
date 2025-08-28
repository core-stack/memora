import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArangoModule } from './services/arango/arango.module';
import { IngestModule } from './modules/ingest/ingest.module';
import { SearchModule } from './modules/search/search.module';

@Module({
  imports: [ArangoModule, IngestModule, SearchModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
