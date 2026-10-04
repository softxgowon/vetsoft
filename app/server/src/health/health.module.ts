import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsModule } from '../notifications/notifications.module';
import { PetsModule } from '../pets/pets.module';
import { HealthController } from './health.controller';
import { LabResult, MedicalRecord, Prescription, Vaccination } from './health.entities';
import { HealthService } from './health.service';

@Module({
  imports: [TypeOrmModule.forFeature([MedicalRecord, LabResult, Prescription, Vaccination]), PetsModule, NotificationsModule],
  controllers: [HealthController],
  providers: [HealthService],
  exports: [TypeOrmModule],
})
export class HealthModule {}
