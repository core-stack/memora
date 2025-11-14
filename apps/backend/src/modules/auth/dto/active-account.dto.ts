import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class ActiveAccountDto {
  @ApiProperty()
  @IsUUID()
  token: string;
}
