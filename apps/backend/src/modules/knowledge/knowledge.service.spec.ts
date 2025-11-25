import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Queue } from "bullmq";
import { DataSource, Repository } from "typeorm";
import { NotFoundException } from "@nestjs/common";

import { KnowledgeService } from "./knowledge.service";
import { KnowledgeEntity } from "../../entities/knowledge.entity";
import { JobType } from "@/jobs/types";
import { HTTPContext } from "@/shared/http-context/http-context";
import { buildBullInject } from "@/utils/build-bull-inject";

describe("KnowledgeService", () => {
  let service: KnowledgeService;
  let repo: Repository<KnowledgeEntity>;
  let deleteQueue: Queue;

  beforeEach(async () => {
    const repoMock = {
      findOne: jest.fn(),
      findOneOrFail: jest.fn(),
      increment: jest.fn()
    };

    const deleteQueueMock = {
      add: jest.fn()
    };

    const httpContextMock = {
      session: undefined,
      req: {},
      res: {}
    };
    const dataSourceMock = {
      transaction: jest.fn().mockImplementation((cb) => cb(repoMock)),
      getRepository: () => repoMock
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KnowledgeService,
        {
          provide: getRepositoryToken(KnowledgeEntity),
          useValue: repoMock
        },
        {
          provide: buildBullInject(JobType.DELETE_KNOWLEDGE),
          useValue: deleteQueueMock
        },
        {
          provide: HTTPContext,
          useValue: httpContextMock
        },
        {
          provide: DataSource,
          useValue: dataSourceMock
        }
      ]
    }).compile();

    service = module.get<KnowledgeService>(KnowledgeService);
    repo = module.get(getRepositoryToken(KnowledgeEntity));
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
