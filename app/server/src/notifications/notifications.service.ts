import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { NotificationType } from '../common/enums';
import { UsersService } from '../users/users.service';
import { MailService } from './mail.service';
import { NotificationsGateway } from './notifications.gateway';
import { Notification } from './notification.entity';

export interface NotifyInput {
  type: NotificationType;
  title: string;
  body: string;
  payload?: Record<string, unknown>;
}

@Injectable()
export class NotificationsService {
  private readonly log = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(Notification) private readonly repo: Repository<Notification>,
    private readonly gateway: NotificationsGateway,
    private readonly mail: MailService,
    private readonly users: UsersService,
  ) {}

  // сохраняем уведомление, отправляем его в браузер через websocket и дублируем письмом
  async notifyUser(userId: string, input: NotifyInput): Promise<Notification> {
    const saved = await this.repo.save(this.repo.create({ userId, ...input, payload: input.payload ?? null, readAt: null }));
    this.gateway.emitToUser(userId, 'notification', saved);
    void this.sendEmail(userId, input);
    return saved;
  }

  emitToStaff(event: string, data: unknown): void {
    this.gateway.emitToStaff(event, data);
  }

  emitToUser(userId: string, event: string, data: unknown): void {
    this.gateway.emitToUser(userId, event, data);
  }

  broadcastSlotsChanged(doctorId: string, date: string): void {
    this.gateway.broadcastSlotsChanged(doctorId, date);
  }

  async listForUser(userId: string) {
    const [items, unread] = await Promise.all([
      this.repo.find({ where: { userId }, order: { createdAt: 'DESC' }, take: 50 }),
      this.repo.count({ where: { userId, readAt: IsNull() } }),
    ]);
    return { items, unread };
  }

  async markRead(userId: string, id: string): Promise<void> {
    const result = await this.repo.update({ id, userId, readAt: IsNull() }, { readAt: new Date() });
    if (!result.affected) {
      const exists = await this.repo.exist({ where: { id, userId } });
      if (!exists) throw new NotFoundException('Уведомление не найдено');
    }
  }

  async markAllRead(userId: string): Promise<void> {
    await this.repo.update({ userId, readAt: IsNull() }, { readAt: new Date() });
  }

  private async sendEmail(userId: string, input: NotifyInput): Promise<void> {
    try {
      const user = await this.users.findById(userId);
      if (user) await this.mail.send(user.email, input.title, input.body);
    } catch (error) {
      this.log.warn(`ошибка отправки письма: ${(error as Error).message}`);
    }
  }
}
