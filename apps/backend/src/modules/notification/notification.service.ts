import { CrudService } from "@/shared/service";
import { NotificationEntity } from "./notification.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class NotificationService extends CrudService<NotificationEntity> {

}