import { Controller, Get, NotFoundException, Param, ParseUUIDPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiTags } from '@nestjs/swagger';
import { Repository } from 'typeorm';
import { Doctor } from './doctor.entity';

@ApiTags('doctors')
@Controller('doctors')
export class DoctorsController {
  constructor(@InjectRepository(Doctor) private readonly repo: Repository<Doctor>) {}

  @Get()
  list(): Promise<Doctor[]> {
    return this.repo.find({ where: { isActive: true }, order: { sortOrder: 'ASC', fullName: 'ASC' } });
  }

  @Get(':id')
  async getOne(@Param('id', ParseUUIDPipe) id: string): Promise<Doctor> {
    const doctor = await this.repo.findOne({ where: { id, isActive: true } });
    if (!doctor) throw new NotFoundException('Врач не найден');
    return doctor;
  }
}
