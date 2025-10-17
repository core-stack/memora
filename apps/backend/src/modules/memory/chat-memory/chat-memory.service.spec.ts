import { Test, TestingModule } from '@nestjs/testing';
import { ChatMemoryService } from './chat-memory.service';

describe('ChatMemoryService', () => {
  let service: ChatMemoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatMemoryService],
    }).compile();

    service = module.get<ChatMemoryService>(ChatMemoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
