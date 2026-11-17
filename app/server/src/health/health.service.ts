import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { NotificationType } from '../common/enums';
import { AuthUser } from '../common/types';
import { addDays, toZonedDateString } from '../common/tz.util';
import { NotificationsService } from '../notifications/notifications.service';
import { PetsService } from '../pets/pets.service';
import { ConfigService } from '@nestjs/config';
import { CreateLabResultDto, CreatePrescriptionDto, CreateRecordDto, CreateVaccinationDto } from './dto/health.dto';
import { LabResult, MedicalRecord, Prescription, Vaccination } from './health.entities';

@Injectable()
export class HealthService {
  constructor(
    @InjectRepository(MedicalRecord) private readonly records: Repository<MedicalRecord>,
    @InjectRepository(LabResult) private readonly labs: Repository<LabResult>,
    @InjectRepository(Prescription) private readonly prescriptions: Repository<Prescription>,
    @InjectRepository(Vaccination) private readonly vaccinations: Repository<Vaccination>,
    private readonly pets: PetsService,
    private readonly notifications: NotificationsService,
    private readonly config: ConfigService,
  ) {}

  async listRecords(user: AuthUser, petId: string) {
    await this.pets.assertAccess(user, petId);
    return this.records.find({ where: { petId }, relations: { doctor: true }, order: { visitedAt: 'DESC' } });
  }

  async listLabResults(user: AuthUser, petId: string) {
    await this.pets.assertAccess(user, petId);
    return this.labs.find({ where: { petId }, order: { takenAt: 'DESC' } });
  }

  async listPrescriptions(user: AuthUser, petId: string) {
    await this.pets.assertAccess(user, petId);
    return this.prescriptions.find({ where: { petId }, relations: { doctor: true }, order: { prescribedAt: 'DESC' } });
  }

  async listVaccinations(user: AuthUser, petId: string) {
    await this.pets.assertAccess(user, petId);
    return this.vaccinations.find({ where: { petId }, order: { vaccinatedAt: 'DESC' } });
  }

  async createRecord(user: AuthUser, petId: string, dto: CreateRecordDto) {
    const pet = await this.pets.assertAccess(user, petId);
    const saved = await this.records.save(
      this.records.create({
        petId,
        doctorId: dto.doctorId ?? null,
        visitedAt: dto.visitedAt ? new Date(dto.visitedAt) : new Date(),
        complaint: dto.complaint ?? null,
        diagnosis: dto.diagnosis,
        treatment: dto.treatment ?? null,
        recommendations: dto.recommendations ?? null,
      }),
    );
    await this.notifyOwner(pet.ownerId, pet.name, 'Новая запись в истории болезни', saved.diagnosis);
    return saved;
  }

  async createLabResult(user: AuthUser, petId: string, dto: CreateLabResultDto) {
    const pet = await this.pets.assertAccess(user, petId);
    const saved = await this.labs.save(
      this.labs.create({ petId, title: dto.title, takenAt: dto.takenAt, items: dto.items, conclusion: dto.conclusion ?? null }),
    );
    await this.notifyOwner(pet.ownerId, pet.name, 'Готовы результаты анализов', saved.title);
    return saved;
  }

  async createPrescription(user: AuthUser, petId: string, dto: CreatePrescriptionDto) {
    const pet = await this.pets.assertAccess(user, petId);
    const saved = await this.prescriptions.save(
      this.prescriptions.create({
        petId,
        doctorId: dto.doctorId ?? null,
        prescribedAt: dto.prescribedAt ?? new Date().toISOString().slice(0, 10),
        medication: dto.medication,
        dosage: dto.dosage,
        duration: dto.duration ?? null,
        instructions: dto.instructions ?? null,
      }),
    );
    await this.notifyOwner(pet.ownerId, pet.name, 'Новый рецепт', saved.medication);
    return saved;
  }

  async createVaccination(user: AuthUser, petId: string, dto: CreateVaccinationDto) {
    const pet = await this.pets.assertAccess(user, petId);
    const saved = await this.vaccinations.save(
      this.vaccinations.create({
        petId,
        vaccine: dto.vaccine,
        vaccinatedAt: dto.vaccinatedAt,
        nextDueAt: dto.nextDueAt ?? null,
        batchNumber: dto.batchNumber ?? null,
      }),
    );
    await this.notifyOwner(pet.ownerId, pet.name, 'Отметка о вакцинации', saved.vaccine);
    return saved;
  }

  // ближайшие и просроченные вакцинации всех питомцев владельца
  async upcomingVaccinations(user: AuthUser, daysAhead = 60) {
    const tz = this.config.get<string>('CLINIC_TIMEZONE', 'Europe/Moscow');
    const limit = addDays(toZonedDateString(new Date(), tz), daysAhead);
    return this.vaccinations
      .createQueryBuilder('v')
      .innerJoinAndSelect('v.pet', 'pet')
      .where('pet.ownerId = :ownerId', { ownerId: user.id })
      .andWhere('v.nextDueAt IS NOT NULL')
      .andWhere('v.nextDueAt <= :limit', { limit })
      .orderBy('v.nextDueAt', 'ASC')
      .getMany();
  }

  private notifyOwner(ownerId: string, petName: string, title: string, body: string) {
    return this.notifications.notifyUser(ownerId, {
      type: NotificationType.HealthRecord,
      title,
      body: `${petName}: ${body}`,
    });
  }
}
