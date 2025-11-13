import { Repository } from "typeorm";
import { NotificationEntity } from "./notification.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class NotificationRepository extends Repository<NotificationEntity> {}