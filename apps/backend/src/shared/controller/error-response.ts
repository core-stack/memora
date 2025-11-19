import { ApiProperty } from "@nestjs/swagger";

export class ErrorResponse {
  @ApiProperty()
  error: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  timestamp: Date;
}
