import { Test, TestingModule } from '@nestjs/testing';
import { SourceController } from './source.controller';
import { SourceService } from './source.service';

describe('SourceController', () => {
  let controller: SourceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SourceController],
      providers: [SourceService],
    }).compile();

    controller = module.get<SourceController>(SourceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
