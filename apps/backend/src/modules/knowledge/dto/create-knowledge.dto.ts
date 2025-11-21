import { PickType } from "@nestjs/swagger";

import { KnowledgeEntity } from "@/entities";

export class CreateKnowledgeDto extends PickType(KnowledgeEntity, [
  "slug",
  "title",
  "description"
] as const) {}
