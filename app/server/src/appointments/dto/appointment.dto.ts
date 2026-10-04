import { IsDateString, IsEnum, IsIn, IsOptional, IsString, IsUUID, Matches, MaxLength } from 'class-validator';
import { AppointmentStatus } from '../../common/enums';

export class CreateAppointmentDto {
  @IsUUID()
  petId: string;

  @IsUUID()
  doctorId: string;

  @IsOptional()
  @IsUUID()
  serviceId?: string;

  // начало приема в формате iso, должно совпадать с одним из свободных слотов
  @IsDateString()
  startsAt: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  reason?: string;
}

export class UpdateStatusDto {
  @IsIn([AppointmentStatus.Completed, AppointmentStatus.NoShow, AppointmentStatus.Cancelled])
  status: AppointmentStatus.Completed | AppointmentStatus.NoShow | AppointmentStatus.Cancelled;
}

export class ListAppointmentsQuery {
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date должен быть в формате yyyy-mm-dd' })
  date?: string;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;
}

export class SlotsQuery {
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date должен быть в формате yyyy-mm-dd' })
  date: string;
}
