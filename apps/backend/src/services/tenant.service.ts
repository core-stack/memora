import { env } from "@/env";
import { CrudService } from "@/generics";

export abstract class TenantService<TEntity> extends CrudService<TEntity> {
  override create(input: Partial<TEntity>): Promise<TEntity> {
    return super.create({
      ...input,
      tenantId: env.TENANT_ID
    })
  }

  override update(id: string, input: Partial<TEntity>): Promise<void> {
    return super.update(id, {
      ...input,
      tenantId: env.TENANT_ID
    })
  }
}