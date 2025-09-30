import { env } from "@/env";
import { CrudService } from "@/generics";
import { HttpContext } from "@/generics/http-context";

export abstract class TenantService<TEntity> extends CrudService<TEntity> {
  override create(input: Partial<TEntity>, ctx: HttpContext): Promise<TEntity> {
    return super.create({
      ...input,
      tenantId: env.TENANT_ID
    }, ctx);
  }

  override update(id: string, input: Partial<TEntity>, ctx: HttpContext): Promise<void> {
    return super.update(id, {
      ...input,
      tenantId: env.TENANT_ID
    }, ctx)
  }
}