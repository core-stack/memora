import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsOptional, MinLength, MaxLength } from "class-validator";

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6, { message: "The password must be at least 6 characters" })
  @MaxLength(100, { message: "The password must be at most 100 characters" })
  password: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  redirect?: string;
}
