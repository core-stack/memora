import { Service } from '@/shared/service';
import { Injectable, Logger } from '@nestjs/common';

import { NotificationEntity } from './notification.entity';

@Injectable()
export class NotificationService extends Service<NotificationEntity> {
  entity = NotificationEntity;
  logger = new Logger(NotificationService.name);
}