import { IsNumber, IsString, Max, MinLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { formatBytes } from '@snipet/common';

import { maxUploadFileSize } from '../constants';

export class GetUploadUrlDto {
  @ApiProperty({ example: "my-file.pdf" })
  @IsString()
  @MinLength(1)
  fileName: string;

  @ApiProperty({ example: "application/pdf" })
  @IsString()
  @MinLength(1)
  contentType: string;

  @ApiProperty({ example: maxUploadFileSize, description: `File size in bytes (max: ${formatBytes(maxUploadFileSize)}` })
  @IsNumber()
  @Max(maxUploadFileSize)
  fileSize: number;
}
