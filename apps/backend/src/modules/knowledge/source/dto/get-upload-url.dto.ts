import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, Max, MinLength } from "class-validator";

export class GetUploadUrlDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  fileName: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  contentType: string;

  @ApiProperty()
  @IsNumber()
  @Max(100 * 1024 * 1024)
  fileSize: number;
}
