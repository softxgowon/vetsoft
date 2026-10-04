import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

// эндпоинт для healthcheck в docker и мониторинга
@ApiExcludeController()
@Controller('health')
export class HealthCheckController {
  constructor(@InjectDataSource() private readonly db: DataSource) {}

  @Get()
  async check() {
    await this.db.query('SELECT 1');
    return { status: 'ok' };
  }
}
