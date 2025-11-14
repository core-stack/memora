import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsString, MinLength, MaxLength } from "class-validator";

export class ResetPasswordDto {
  @ApiProperty()
  @IsUUID()
  token: string;

  @ApiProperty()
  @IsString()
  @MinLength(6, { message: "The password must be at least 6 characters" })
  @MaxLength(100, { message: "The password must be at most 100 characters" })
  password: string;
}
