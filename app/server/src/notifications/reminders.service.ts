import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, IsNull, Repository } from 'typeorm';
import { Appointment } from '../appointments/appointment.entity';
import { AppointmentStatus, NotificationType } from '../common/enums';
import { addDays, formatDateTimeRu, toZonedDateString, zonedHour } from '../common/tz.util';
import { Vaccination } from '../health/health.entities';
import { NotificationsService } from './notifications.service';

const HOUR = 3_600_000;
// час по времени клиники, в который отправляются напоминания о вакцинации
const VACCINATION_REMINDER_HOUR = 9;
const VACCINATION_REMINDER_DAYS = 7;

@Injectable()
export class RemindersService {
  private readonly log = new Logger(RemindersService.name);

  constructor(
    @InjectRepository(Appointment) private readonly appointments: Repository<Appointment>,
    @InjectRepository(Vaccination) private readonly vaccinations: Repository<Vaccination>,
    private readonly notifications: NotificationsService,
    private readonly config: ConfigService,
  ) {}

  private get timeZone(): string {
    return this.config.get<string>('CLINIC_TIMEZONE', 'Europe/Moscow');
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleAppointmentReminders(): Promise<void> {
    try {
      const sent = await this.sendAppointmentReminders(new Date());
      if (sent) this.log.log(`отправлено напоминаний о приеме: ${sent}`);
    } catch (error) {
      this.log.error(`ошибка напоминаний о приеме: ${(error as Error).message}`);
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async handleVaccinationReminders(): Promise<void> {
    const now = new Date();
    if (zonedHour(now, this.timeZone) !== VACCINATION_REMINDER_HOUR) return;
    try {
      const sent = await this.sendVaccinationReminders(now);
      if (sent) this.log.log(`отправлено напоминаний о вакцинации: ${sent}`);
    } catch (error) {
      this.log.error(`ошибка напоминаний о вакцинации: ${(error as Error).message}`);
    }
  }

  // за сутки и за два часа до приема, каждое напоминание уходит один раз
  async sendAppointmentReminders(now: Date): Promise<number> {
    const in2h = new Date(now.getTime() + 2 * HOUR);
    const in24h = new Date(now.getTime() + 24 * HOUR);
    let sent = 0;

    const dayBefore = await this.appointments.find({
      where: { status: AppointmentStatus.Scheduled, reminder24hSentAt: IsNull(), startsAt: Between(in2h, in24h) },
      relations: { pet: true, doctor: true },
    });
    for (const a of dayBefore) {
      await this.remind(a, 'Напоминание: завтра прием');
      a.reminder24hSentAt = now;
      await this.appointments.save(a);
      sent++;
    }

    const soon = await this.appointments.find({
      where: { status: AppointmentStatus.Scheduled, reminder2hSentAt: IsNull(), startsAt: Between(now, in2h) },
      relations: { pet: true, doctor: true },
    });
    for (const a of soon) {
      await this.remind(a, 'Напоминание: прием совсем скоро');
      a.reminder2hSentAt = now;
      await this.appointments.save(a);
      sent++;
    }
    return sent;
  }

  // за неделю до даты ревакцинации
  async sendVaccinationReminders(now: Date): Promise<number> {
    const today = toZonedDateString(now, this.timeZone);
    const due = await this.vaccinations.find({
      where: { reminderSentAt: IsNull(), nextDueAt: Between(today, addDays(today, VACCINATION_REMINDER_DAYS)) },
      relations: { pet: true },
    });
    for (const v of due) {
      await this.notifications.notifyUser(v.pet!.ownerId, {
        type: NotificationType.VaccinationReminder,
        title: 'Пора делать прививку',
        body: `${v.pet!.name}: ${v.vaccine}, до ${v.nextDueAt}`,
        payload: { petId: v.petId, vaccinationId: v.id },
      });
      v.reminderSentAt = now;
      await this.vaccinations.save(v);
    }
    return due.length;
  }

  private remind(a: Appointment, title: string) {
    return this.notifications.notifyUser(a.pet!.ownerId, {
      type: NotificationType.AppointmentReminder,
      title,
      body: `${a.pet!.name}: ${a.doctor!.fullName}, ${formatDateTimeRu(a.startsAt, this.timeZone)}`,
      payload: { appointmentId: a.id },
    });
  }
}
