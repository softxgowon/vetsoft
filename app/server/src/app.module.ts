import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsModule } from './appointments/appointments.module';
import { AuthModule } from './auth/auth.module';
import { CatalogModule } from './catalog/catalog.module';
import { DoctorsModule } from './doctors/doctors.module';
import { HealthCheckController } from './health-check.controller';
import { HealthModule } from './health/health.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PetsModule } from './pets/pets.module';
import { SeedModule } from './seed/seed.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 200 }]),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        host: config.get<string>('DB_HOST', 'localhost'),
        port: Number(config.get('DB_PORT', 5432)),
        username: config.get<string>('DB_USER', 'vetsoft'),
        password: config.get<string>('DB_PASSWORD', 'vetsoft'),
        database: config.get<string>('DB_NAME', 'vetsoft'),
        autoLoadEntities: true,
        synchronize: config.get('DB_SYNCHRONIZE', 'true') === 'true',
        retryAttempts: 10,
        retryDelay: 3000,
      }),
    }),
    UsersModule,
    AuthModule,
    PetsModule,
    HealthModule,
    DoctorsModule,
    CatalogModule,
    AppointmentsModule,
    NotificationsModule,
    SeedModule,
  ],
  controllers: [HealthCheckController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
