import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article, CheckupPackage, Department, ServiceCategory, ServiceItem } from './catalog.entities';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { GeocodingService } from './geocoding.service';

@Module({
  imports: [TypeOrmModule.forFeature([Department, ServiceCategory, ServiceItem, CheckupPackage, Article])],
  controllers: [CatalogController],
  providers: [CatalogService, GeocodingService],
  exports: [TypeOrmModule],
})
export class CatalogModule {}
