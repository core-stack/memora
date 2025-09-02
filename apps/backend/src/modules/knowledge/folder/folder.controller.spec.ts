import { Test, TestingModule } from '@nestjs/testing';
import { FolderController } from './folder.controller';
import { FolderService } from './folder.service';

describe('FolderController', () => {
  let controller: FolderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FolderController],
      providers: [FolderService],
    }).compile();

    controller = module.get<FolderController>(FolderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
