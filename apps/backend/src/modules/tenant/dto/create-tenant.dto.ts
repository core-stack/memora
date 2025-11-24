import { TenantEntity } from '@/entities';
import { PickType } from '@nestjs/swagger';

export class CreateTenantDto extends PickType(TenantEntity, [ "name", "description", "backgroundImage" ] as const) {
  userId?: string;
}
