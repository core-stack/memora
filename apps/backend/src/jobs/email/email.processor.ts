import { Job } from 'bullmq';

import { Processor, WorkerHost } from '@nestjs/bullmq';

import { JobType } from '../types';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailPayload } from './schemas';
import { env } from '@/env';

@Processor(JobType.SEND_EMAIL, { concurrency: 10 })
export class EmailProcessor extends WorkerHost {

  constructor(private readonly mailerService: MailerService) { super(); }

  async process(job: Job<EmailPayload>) {
    await this.mailerService.sendMail({
      ...job.data,
      to: env.SMTP_ENV !== "production" ? env.SMTP_TEST_EMAIL : job.data.to,
      from: job.data.from ?? env.SMTP_FROM,
    });
  }
}
