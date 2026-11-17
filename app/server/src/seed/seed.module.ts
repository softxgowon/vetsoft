import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogModule } from '../catalog/catalog.module';
import { DoctorsModule } from '../doctors/doctors.module';
import { HealthModule } from '../health/health.module';
import { PetsModule } from '../pets/pets.module';
import { User } from '../users/user.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CatalogModule, DoctorsModule, HealthModule, PetsModule],
  providers: [SeedService],
})
export class SeedModule {}
