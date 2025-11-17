import { NotificationEntity } from '@/entities/notification.entity';
import { Service } from '@/shared/service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationService extends Service<NotificationEntity> {
  entity = NotificationEntity;
  logger = new Logger(NotificationService.name);
}