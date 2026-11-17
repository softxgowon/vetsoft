import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from '../appointments/appointment.entity';
import { AuthModule } from '../auth/auth.module';
import { Vaccination } from '../health/health.entities';
import { UsersModule } from '../users/users.module';
import { MailService } from './mail.service';
import { Notification } from './notification.entity';
import { NotificationsController } from './notifications.controller';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService } from './notifications.service';
import { RemindersService } from './reminders.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, Appointment, Vaccination]), AuthModule, UsersModule],
  controllers: [NotificationsController],
  providers: [NotificationsGateway, NotificationsService, MailService, RemindersService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
