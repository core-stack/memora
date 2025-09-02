import { Module } from '@nestjs/common';
import { FolderService } from './folder.service';
import { FolderController } from './folder.controller';

@Module({
  controllers: [FolderController],
  providers: [FolderService],
})
export class FolderModule {}
