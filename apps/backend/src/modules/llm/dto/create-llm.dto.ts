import { LLMEntity } from '@/entities';
import { PickType } from '@nestjs/swagger';

export class CreateLLMDto extends PickType(LLMEntity, [ "type", "model", "config", "name" ]) {}