import { Test, TestingModule } from '@nestjs/testing';
import { IngestController } from './ingest.controller';
import { IngestService } from './ingest.service';

describe('IngestController', () => {
  let controller: IngestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestController],
      providers: [IngestService],
    }).compile();

    controller = module.get<IngestController>(IngestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
