import { Job } from 'bullmq';

import { env } from '@/env';
import { MailerService } from '@nestjs-modules/mailer';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';

import { JobType } from '../types';
import { EmailPayload } from './schemas';

@Processor(JobType.SEND_EMAIL, { concurrency: 10 })
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);
  constructor(private readonly mailerService: MailerService) { super(); }

  async process(job: Job<EmailPayload>) {
    if (env.SMTP_ENABLED) {
      await this.mailerService.sendMail({
        ...job.data,
        to: env.SMTP_ENV !== "production" ? env.SMTP_TEST_EMAIL : job.data.to,
        from: job.data.from ?? env.SMTP_FROM,
      });
    } else {
      this.logger.debug("SMTP is not enabled");
      this.logger.debug(job.data);
    }
  }
}
