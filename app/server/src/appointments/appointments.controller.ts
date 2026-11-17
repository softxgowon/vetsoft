import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../common/decorators/auth.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums';
import { AuthUser } from '../common/types';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto, ListAppointmentsQuery, SlotsQuery, UpdateStatusDto } from './dto/appointment.dto';

@ApiTags('appointments')
@Controller()
export class AppointmentsController {
  constructor(private readonly appointments: AppointmentsService) {}

  @Get('doctors/:id/slots')
  slots(@Param('id', ParseUUIDPipe) id: string, @Query() query: SlotsQuery) {
    return this.appointments.getSlots(id, query.date);
  }

  @Get('appointments')
  @Auth()
  list(@CurrentUser() user: AuthUser, @Query() query: ListAppointmentsQuery) {
    return this.appointments.list(user, query);
  }

  @Post('appointments')
  @Auth()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateAppointmentDto) {
    return this.appointments.create(user, dto);
  }

  @Post('appointments/:id/cancel')
  @Auth()
  cancel(@CurrentUser() user: AuthUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.appointments.cancel(user, id);
  }

  @Patch('appointments/:id/status')
  @Auth(Role.Doctor, Role.Admin)
  setStatus(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateStatusDto) {
    return this.appointments.setStatus(id, dto.status);
  }
}
