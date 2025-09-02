import { Module } from '@nestjs/common';
import { SourceService } from './source.service';
import { SourceController } from './source.controller';

@Module({
  controllers: [SourceController],
  providers: [SourceService],
})
export class SourceModule {}
