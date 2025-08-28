import { Module } from '@nestjs/common';
import { IngestService } from './ingest.service';
import { IngestController } from './ingest.controller';

@Module({
  controllers: [IngestController],
  providers: [IngestService],
})
export class IngestModule {}
