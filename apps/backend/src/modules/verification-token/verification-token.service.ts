import { Service } from "@/shared/service";
import { Injectable, Logger } from "@nestjs/common";

import { VerificationTokenEntity } from "../../entities/verification-token.entity";

@Injectable()
export class VerificationTokenService extends Service<VerificationTokenEntity> {
  entity = VerificationTokenEntity;
  logger = new Logger(VerificationTokenService.name);
}
