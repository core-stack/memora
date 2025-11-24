import { DataSource, EntityManager } from "typeorm";

import { Inject, Logger } from "@nestjs/common";

import { HTTPContext } from "./http-context/http-context";

export abstract class GenericService {
  @Inject() protected readonly context: HTTPContext;
  @Inject() protected readonly dataSource: DataSource;

  abstract readonly logger: Logger;

  async transaction<T>(
    callback: (manager: EntityManager) => Promise<T>,
    manager?: EntityManager
  ): Promise<T> {
    if (manager) return await callback(manager);
    return await this.dataSource.transaction(callback);
  }
}
