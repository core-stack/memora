import { Test, TestingModule } from "@nestjs/testing";

import { IngestProcessor } from "./ingest.processor";

describe('IngestService', () => {
  let service: IngestProcessor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IngestProcessor],
    }).compile();

    service = module.get<IngestProcessor>(IngestProcessor);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
