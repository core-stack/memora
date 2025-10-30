import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { EmailProcessor } from './email.processor';
import { MailerModule } from '@nestjs-modules/mailer';
import { env } from '@/env';
import { JobType } from '../types';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';
import path from 'path';
import { __root } from '@/root';

@Module({
  providers: [ EmailProcessor ],
  imports: [
    BullModule.registerQueue({ name: JobType.SEND_EMAIL }),
    BullBoardModule.forFeature({ name: JobType.SEND_EMAIL, adapter: BullMQAdapter }),
    MailerModule.forRoot({
      transport: {
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_SECURE,
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASSWORD,
        },
      },
      template: {
        dir: path.join(__root, "email-templates"),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      }
    })
  ],
  exports: [ BullModule ]
})
export class EmailModule {}
