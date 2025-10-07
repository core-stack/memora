import { env } from '@/env';
import { CrudService } from '@/generics';
import { HttpContext } from '@/generics/http-context';

export abstract class TenantService<TEntity, TCreateDto = Partial<TEntity>, TUpdateDto = Partial<TEntity>> extends CrudService<TEntity,TCreateDto, TUpdateDto> {
  override create(input: TCreateDto, ctx: HttpContext): Promise<TEntity> {
    return super.create({
      ...input,
      tenantId: env.TENANT_ID
    });
  }

  override update(id: string, input: TUpdateDto, ctx: HttpContext): Promise<void> {
    return super.update(id, {
      ...input,
      tenantId: env.TENANT_ID
    })
  }
}