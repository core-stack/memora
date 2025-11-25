import { Test, TestingModule } from "@nestjs/testing";
import { Queue } from "bullmq";
import { Repository } from "typeorm";
import { NotFoundException } from "@nestjs/common";

import { KnowledgeService } from "./knowledge.service";
import { KnowledgeEntity } from "../../entities/knowledge.entity";
import { JobType } from "@/jobs/types";
import { buildBullInject } from "@/utils/build-bull-inject";
import { createServiceProvidersMock } from "@/@mocks/service-providers";

describe("KnowledgeService", () => {
  let service: KnowledgeService;
  let repo: Repository<KnowledgeEntity>;
  let deleteQueue: Queue;

  beforeEach(async () => {

    const deleteQueueMock = {
      add: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KnowledgeService,
        {
          provide: buildBullInject(JobType.DELETE_KNOWLEDGE),
          useValue: deleteQueueMock
        },
        ...createServiceProvidersMock(KnowledgeEntity)
      ]
    }).compile();

    service = module.get<KnowledgeService>(KnowledgeService);
    repo = (service as any).dataSource.getRepository(KnowledgeEntity);
    deleteQueue = module.get(buildBullInject(JobType.DELETE_KNOWLEDGE));
  });

  // ----------------------------------------
  // delete
  // ----------------------------------------
  it("should enqueue delete job when deleting knowledge", async () => {
    const mockEntity = { id: "1", name: "Test Knowledge" };
    repo.findOneOrFail = jest.fn().mockResolvedValue(mockEntity);

    await service.delete("1");

    expect(repo.findOneOrFail).toHaveBeenCalledWith({ where: { id: "1" } });

    expect(deleteQueue.add).toHaveBeenCalledWith(
      JobType.DELETE_KNOWLEDGE,
      mockEntity,
      expect.objectContaining({
        backoff: { type: "exponential", delay: 1000 }
      })
    );
  });

  it("should throw NotFoundException if knowledge does not exist on delete", async () => {
    repo.findOneOrFail = jest.fn().mockRejectedValue(new NotFoundException("not found"));

    await expect(service.delete("999")).rejects.toThrow(NotFoundException);
  });

  // ----------------------------------------
  // increaseFileCount
  // ----------------------------------------
  it("should increase file count successfully", async () => {
    repo.increment = jest.fn().mockResolvedValue({ affected: 1 });

    const result = await service.increaseFileCount("k1", 2);

    expect(repo.increment).toHaveBeenCalledWith({ id: "k1" }, "files", 2);
    expect(result).toBe(true);
  });

  it("should return false if file count not updated", async () => {
    repo.increment = jest.fn().mockResolvedValue({ affected: 0 });

    const result = await service.increaseFileCount("k1", 2);

    expect(result).toBe(false);
  });

  // ----------------------------------------
  // increaseStorageCount
  // ----------------------------------------
  it("should increase storage count successfully", async () => {
    repo.increment = jest.fn().mockResolvedValue({ affected: 1 });

    const result = await service.increaseStorageCount("k1", 5);

    expect(repo.increment).toHaveBeenCalledWith({ id: "k1" }, "storage", 5);
    expect(result).toBe(true);
  });

  it("should return false if storage count not updated", async () => {
    repo.increment = jest.fn().mockResolvedValue({ affected: 0 });

    const result = await service.increaseStorageCount("k1", 5);

    expect(result).toBe(false);
  });
});
