import { LLMEntity } from "@/entities";
import { TenantId } from "@/shared/controller/decorators";
import { Field } from "@/shared/model";
import { PickType } from "@nestjs/swagger";

export class CreateLLMDto
  extends PickType(LLMEntity, [ "type", "model", "key", "name", "default" ])
{
  @Field({
    type: "object",
    additionalProperties: {
      type: "string"
    },
    description: "The configuration for the LLM"
  })
  config: Record<string, any>;

  @TenantId()
  tenantId: string;
}
