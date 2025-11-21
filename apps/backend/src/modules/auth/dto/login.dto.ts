import { Field } from "@/shared/model";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsOptional, MinLength, MaxLength } from "class-validator";

export class LoginDto {
  @Field({
    type: "string",
    description: "The email of the user",
    example: "my@example.com",
    email: true,
    required: true
  })
  email: string;

  @Field({
    type: "string",
    description: "The password of the user",
    password: true,
    min: { length: 6, message: "The password must be at least 6 characters" },
    max: { length: 100, message: "The password must be at most 100 characters" },
    required: true
  })
  password: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Field({ type: "string", description: "The path to redirect", example: "/" })
  redirect?: string;

  constructor(data: Partial<LoginDto>) {
    Object.assign(this, data);
  }
}

export class LoginResponseDto {
  @Field({
    type: "string",
    description: "The path to redirect (the same as the one in the request)",
    example: "/"
  })
  redirect?: string;

  constructor(data: Partial<LoginResponseDto>) {
    Object.assign(this, data);
  }
}
