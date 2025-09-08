import type { Request } from 'express';
import { promises as fs } from 'fs';
import { join } from 'path';

import {
  BadRequestException, Controller, Param, Put, Req, UnauthorizedException
} from '@nestjs/common';

import { LocalStorageService } from './';

@Controller()
export class LocalUploadController {
  @Put('local-upload/:token')
  async upload(@Param('token') token: string, @Req() req: Request) {
    const tokenPath = join(LocalStorageService.basePath, 'tokens', token);
    
    try {
      const content = JSON.parse(await fs.readFile(tokenPath, 'utf8'));
      if (Date.now() > content.exp) {
        throw new UnauthorizedException('Token expired');
      }

      // ler o corpo cru da request
      const chunks: Buffer[] = [];
      
      await new Promise<void>((resolve, reject) => {
        req.on('data', (chunk) => chunks.push(chunk));
        req.on('end', () => resolve());
        req.on('error', reject);
      });

      const fileBuffer = Buffer.concat(chunks);

      // salvar no caminho definido
      const filePath = join(process.cwd(), 'uploads', content.key);
      await fs.mkdir(join(filePath, '..'), { recursive: true });
      await fs.writeFile(filePath, fileBuffer);

      // apagar token
      await fs.unlink(tokenPath);

      return { success: true, url: `/uploads/${content.key}` };
    } catch (e) {
      throw new BadRequestException('Invalid or expired token');
    }
  }
}
