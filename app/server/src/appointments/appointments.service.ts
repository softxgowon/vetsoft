import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Not, Repository } from 'typeorm';
import { AppointmentStatus, isStaff, NotificationType } from '../common/enums';
import { AuthUser } from '../common/types';
import { addDays, formatDateTimeRu, isValidDateString, toZonedDateString, zonedToUtc } from '../common/tz.util';
import { ServiceItem } from '../catalog/catalog.entities';
import { Doctor } from '../doctors/doctor.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { PetsService } from '../pets/pets.service';
import { Appointment } from './appointment.entity';
import { CreateAppointmentDto } from './dto/appointment.dto';
import { buildDaySlots } from './slots.util';

// запись нельзя создать меньше чем за столько минут до начала
export const MIN_LEAD_MINUTES = 30;

export interface SlotInfo {
  startsAt: string;
  available: boolean;
}

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment) private readonly repo: Repository<Appointment>,
    @InjectRepository(Doctor) private readonly doctors: Repository<Doctor>,
    @InjectRepository(ServiceItem) private readonly services: Repository<ServiceItem>,
    private readonly pets: PetsService,
    private readonly notifications: NotificationsService,
    private readonly config: ConfigService,
  ) {}

  private get timeZone(): string {
    return this.config.get<string>('CLINIC_TIMEZONE', 'Europe/Moscow');
  }

  async getSlots(doctorId: string, date: string): Promise<{ date: string; timeZone: string; slots: SlotInfo[] }> {
    if (!isValidDateString(date)) throw new BadRequestException('Некорректная дата');
    const doctor = await this.doctors.findOne({ where: { id: doctorId, isActive: true } });
    if (!doctor) throw new NotFoundException('Врач не найден');

    const all = buildDaySlots(date, doctor, this.timeZone);
    const busy = all.length
      ? await this.repo.find({
          select: { id: true, startsAt: true },
          where: { doctorId, status: Not(AppointmentStatus.Cancelled), startsAt: Between(all[0], all[all.length - 1]) },
        })
      : [];
    const busySet = new Set(busy.map((a) => new Date(a.startsAt).getTime()));
    const earliest = Date.now() + MIN_LEAD_MINUTES * 60_000;

    return {
      date,
      timeZone: this.timeZone,
      slots: all.map((s) => ({ startsAt: s.toISOString(), available: s.getTime() >= earliest && !busySet.has(s.getTime()) })),
    };
  }

  async create(user: AuthUser, dto: CreateAppointmentDto): Promise<Appointment> {
    const pet = await this.pets.assertAccess(user, dto.petId);
    const doctor = await this.doctors.findOne({ where: { id: dto.doctorId, isActive: true } });
    if (!doctor) throw new NotFoundException('Врач не найден');
    if (dto.serviceId && !(await this.services.exist({ where: { id: dto.serviceId } }))) {
      throw new NotFoundException('Услуга не найдена');
    }

    const startsAt = new Date(dto.startsAt);
    const date = toZonedDateString(startsAt, this.timeZone);
    const { slots } = await this.getSlots(doctor.id, date);
    const slot = slots.find((s) => new Date(s.startsAt).getTime() === startsAt.getTime());
    if (!slot) throw new BadRequestException('Некорректное время приема');
    if (!slot.available) throw new ConflictException('Это время уже занято или недоступно');

    let saved: Appointment;
    try {
      saved = await this.repo.save(
        this.repo.create({
          petId: pet.id,
          doctorId: doctor.id,
          serviceId: dto.serviceId ?? null,
          startsAt,
          endsAt: new Date(startsAt.getTime() + doctor.slotMinutes * 60_000),
          status: AppointmentStatus.Scheduled,
          reason: dto.reason?.trim() || null,
        }),
      );
    } catch (error) {
      // два клиента одновременно заняли один слот, уникальный индекс не дал создать дубль
      if (this.isUniqueViolation(error)) throw new ConflictException('Это время уже занято или недоступно');
      throw error;
    }

    await this.notifications.notifyUser(pet.ownerId, {
      type: NotificationType.AppointmentCreated,
      title: 'Запись подтверждена',
      body: `${pet.name}: ${doctor.fullName}, ${formatDateTimeRu(startsAt, this.timeZone)}`,
      payload: { appointmentId: saved.id },
    });
    this.notifications.emitToStaff('appointment:changed', { id: saved.id, action: 'created' });
    this.notifications.broadcastSlotsChanged(doctor.id, date);
    return saved;
  }

  async list(user: AuthUser, filter: { date?: string; status?: AppointmentStatus } = {}): Promise<Appointment[]> {
    const qb = this.repo
      .createQueryBuilder('a')
      .innerJoinAndSelect('a.pet', 'pet')
      .innerJoinAndSelect('a.doctor', 'doctor')
      .leftJoinAndSelect('a.service', 'service')
      .orderBy('a.startsAt', 'ASC');

    if (isStaff(user.role)) qb.innerJoinAndSelect('pet.owner', 'owner');
    else qb.where('pet.ownerId = :ownerId', { ownerId: user.id });

    if (filter.date) {
      if (!isValidDateString(filter.date)) throw new BadRequestException('Некорректная дата');
      const from = zonedToUtc(filter.date, '00:00', this.timeZone);
      const to = zonedToUtc(addDays(filter.date, 1), '00:00', this.timeZone);
      qb.andWhere('a.startsAt >= :from AND a.startsAt < :to', { from, to });
    }
    if (filter.status) qb.andWhere('a.status = :status', { status: filter.status });
    return qb.getMany();
  }

  async cancel(user: AuthUser, id: string): Promise<Appointment> {
    const appointment = await this.load(id);
    if (!isStaff(user.role) && appointment.pet!.ownerId !== user.id) {
      throw new ForbiddenException('Нет доступа к этой записи');
    }
    return this.changeStatus(appointment, AppointmentStatus.Cancelled, isStaff(user.role));
  }

  async setStatus(id: string, status: AppointmentStatus): Promise<Appointment> {
    return this.changeStatus(await this.load(id), status, true);
  }

  private async load(id: string): Promise<Appointment> {
    const appointment = await this.repo.findOne({ where: { id }, relations: { pet: true, doctor: true } });
    if (!appointment) throw new NotFoundException('Запись не найдена');
    return appointment;
  }

  private async changeStatus(appointment: Appointment, status: AppointmentStatus, byStaff: boolean): Promise<Appointment> {
    if (appointment.status !== AppointmentStatus.Scheduled) {
      throw new BadRequestException('Статус этой записи уже нельзя изменить');
    }
    appointment.status = status;
    const saved = await this.repo.save(appointment);

    const when = formatDateTimeRu(appointment.startsAt, this.timeZone);
    const petName = appointment.pet!.name;
    if (byStaff) {
      await this.notifications.notifyUser(appointment.pet!.ownerId, {
        type: status === AppointmentStatus.Cancelled ? NotificationType.AppointmentCancelled : NotificationType.AppointmentStatus,
        title: status === AppointmentStatus.Cancelled ? 'Запись отменена клиникой' : 'Статус визита обновлен',
        body: `${petName}, ${when}`,
        payload: { appointmentId: appointment.id, status },
      });
    }
    this.notifications.emitToStaff('appointment:changed', { id: appointment.id, action: status });
    if (status === AppointmentStatus.Cancelled) {
      this.notifications.broadcastSlotsChanged(appointment.doctorId, toZonedDateString(appointment.startsAt, this.timeZone));
    }
    return saved;
  }

  private isUniqueViolation(error: unknown): boolean {
    const e = error as { code?: string; driverError?: { code?: string } };
    return e?.code === '23505' || e?.driverError?.code === '23505';
  }
}
