// dto/create-account.dto.ts
import { Match } from "@/shared/validators/match.validator";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
} from "class-validator";

export class CreateAccountDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 6, maxLength: 100 })
  @IsString()
  @MinLength(6, { message: "The password must be at least 6 characters" })
  @MaxLength(100, { message: "The password must be at most 100 characters" })
  password: string;

  @ApiProperty({ minLength: 6, maxLength: 100 })
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  @Match("password", { message: "Passwords do not match" })
  confirmPassword: string;
}
