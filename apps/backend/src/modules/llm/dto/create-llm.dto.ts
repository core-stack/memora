import { LLMEntity } from "@/entities";
import { TenantId } from "@/shared/controller/decorators";
import { PickType } from "@nestjs/swagger";

export class CreateLLMDto extends PickType(LLMEntity, [ "type", "model", "config", "name" ]) {
  @TenantId()
  tenantId: string;
}
