import { GenericController } from '@/generics';
import { Controller } from '@nestjs/common';

import { KnowledgeService } from './knowledge.service';

@Controller('knowledge')
export class KnowledgeController extends GenericController {
  constructor(knowledgeService: KnowledgeService) {
    super(knowledgeService);
  }
}
