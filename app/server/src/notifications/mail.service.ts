import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private readonly log = new Logger(MailService.name);
  private readonly transport: Transporter | null;
  private readonly from: string;

  constructor(private readonly config: ConfigService) {
    const host = config.get<string>('SMTP_HOST');
    this.from = config.get<string>('MAIL_FROM', 'VetSoft <no-reply@vetsoft.local>');
    const user = config.get<string>('SMTP_USER');
    this.transport = host
      ? nodemailer.createTransport({
          host,
          port: Number(config.get('SMTP_PORT', 587)),
          secure: config.get('SMTP_SECURE') === 'true',
          auth: user ? { user, pass: config.get<string>('SMTP_PASSWORD') } : undefined,
        })
      : null;
  }

  // без настроенного smtp письма только пишутся в лог, чтобы локальная разработка не ломалась
  async send(to: string, subject: string, text: string): Promise<boolean> {
    if (!this.transport) {
      this.log.debug(`smtp не настроен, письмо для ${to}: ${subject}`);
      return false;
    }
    try {
      await this.transport.sendMail({ from: this.from, to, subject, text });
      return true;
    } catch (error) {
      this.log.warn(`не удалось отправить письмо для ${to}: ${(error as Error).message}`);
      return false;
    }
  }
}
