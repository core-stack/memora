import { Test, TestingModule } from '@nestjs/testing';
import { ArangoService } from './arango.service';

describe('ArangoService', () => {
  let service: ArangoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArangoService],
    }).compile();

    service = module.get<ArangoService>(ArangoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
