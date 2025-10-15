import { Test, TestingModule } from '@nestjs/testing';
import { SourceMemoryService } from './source-memory.service';

describe('SourceMemoryService', () => {
  let service: SourceMemoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SourceMemoryService],
    }).compile();

    service = module.get<SourceMemoryService>(SourceMemoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
