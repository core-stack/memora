import { ApiProperty } from '@nestjs/swagger';

export class FileURLResponseDto {
  @ApiProperty({ example: "https://example.com/file.pdf" })
  url: string;

  @ApiProperty({ example: "path/to/my-file.pdf" })
  key: string;

  constructor(data: Partial<FileURLResponseDto>) {
    Object.assign(this, data);
  }
}