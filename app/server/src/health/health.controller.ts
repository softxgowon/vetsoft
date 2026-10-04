import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../common/decorators/auth.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums';
import { AuthUser } from '../common/types';
import { CreateLabResultDto, CreatePrescriptionDto, CreateRecordDto, CreateVaccinationDto } from './dto/health.dto';
import { HealthService } from './health.service';

@ApiTags('health')
@Controller()
@Auth()
export class HealthController {
  constructor(private readonly health: HealthService) {}

  @Get('vaccinations/upcoming')
  upcoming(@CurrentUser() user: AuthUser) {
    return this.health.upcomingVaccinations(user);
  }

  @Get('pets/:petId/records')
  records(@CurrentUser() user: AuthUser, @Param('petId', ParseUUIDPipe) petId: string) {
    return this.health.listRecords(user, petId);
  }

  @Post('pets/:petId/records')
  @Auth(Role.Doctor, Role.Admin)
  addRecord(@CurrentUser() user: AuthUser, @Param('petId', ParseUUIDPipe) petId: string, @Body() dto: CreateRecordDto) {
    return this.health.createRecord(user, petId, dto);
  }

  @Get('pets/:petId/lab-results')
  labResults(@CurrentUser() user: AuthUser, @Param('petId', ParseUUIDPipe) petId: string) {
    return this.health.listLabResults(user, petId);
  }

  @Post('pets/:petId/lab-results')
  @Auth(Role.Doctor, Role.Admin)
  addLabResult(@CurrentUser() user: AuthUser, @Param('petId', ParseUUIDPipe) petId: string, @Body() dto: CreateLabResultDto) {
    return this.health.createLabResult(user, petId, dto);
  }

  @Get('pets/:petId/prescriptions')
  prescriptions(@CurrentUser() user: AuthUser, @Param('petId', ParseUUIDPipe) petId: string) {
    return this.health.listPrescriptions(user, petId);
  }

  @Post('pets/:petId/prescriptions')
  @Auth(Role.Doctor, Role.Admin)
  addPrescription(@CurrentUser() user: AuthUser, @Param('petId', ParseUUIDPipe) petId: string, @Body() dto: CreatePrescriptionDto) {
    return this.health.createPrescription(user, petId, dto);
  }

  @Get('pets/:petId/vaccinations')
  vaccinations(@CurrentUser() user: AuthUser, @Param('petId', ParseUUIDPipe) petId: string) {
    return this.health.listVaccinations(user, petId);
  }

  @Post('pets/:petId/vaccinations')
  @Auth(Role.Doctor, Role.Admin)
  addVaccination(@CurrentUser() user: AuthUser, @Param('petId', ParseUUIDPipe) petId: string, @Body() dto: CreateVaccinationDto) {
    return this.health.createVaccination(user, petId, dto);
  }
}
