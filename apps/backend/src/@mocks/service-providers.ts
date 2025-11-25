import { Constructor } from "@/types/constructor";
import { Provider } from "@nestjs/common";
import { getRepositoryToken } from "@nestjs/typeorm";
import { DataSource, ObjectLiteral } from "typeorm";
import { createRepositoryMock } from "./repository";
import { HTTPContext } from "@/shared/http-context/http-context";
import { createHttpContextMock } from "./http-context";
import { createDataSourceMock } from "./data-source";
import { createEntityManagerMock } from "./entity-manager";

export const createServiceProvidersMock = <T extends ObjectLiteral>(type: Constructor<T>): Provider[] => {
  const repo = createRepositoryMock();
  const manager = createEntityManagerMock(repo);
  const dataSource = createDataSourceMock(repo, manager);

  return [
    {
      provide: getRepositoryToken(type),
      useValue: createRepositoryMock<typeof type>()
    },
    {
      provide: HTTPContext,
      useValue: createHttpContextMock()
    },
    {
      provide: DataSource,
      useValue: dataSource
    }
  ];
};
