import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article, CheckupPackage, Department, ServiceCategory } from './catalog.entities';
import { GeocodingService } from './geocoding.service';

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
}

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Department) private readonly departments: Repository<Department>,
    @InjectRepository(ServiceCategory) private readonly categories: Repository<ServiceCategory>,
    @InjectRepository(CheckupPackage) private readonly checkups: Repository<CheckupPackage>,
    @InjectRepository(Article) private readonly articles: Repository<Article>,
    private readonly config: ConfigService,
    private readonly geocoding: GeocodingService,
  ) {}

  async clinic() {
    const address = this.config.get<string>('CLINIC_ADDRESS', 'г. Великий Новгород, ул. Кочетова, дом 16/46');
    // координаты для карты определяются автоматически по адресу через nominatim, при неудаче просто не отдаем их,
    // фронтенд в этом случае покажет карту с координатами по умолчанию
    const point = await this.geocoding.geocode(address);
    return {
      name: 'VetSoft',
      phone: this.config.get<string>('CLINIC_PHONE', '+7 999 999 99 99'),
      email: this.config.get<string>('CLINIC_EMAIL', 'mail@vetsoft.local'),
      address,
      hours: 'Круглосуточно 24/7',
      timeZone: this.config.get<string>('CLINIC_TIMEZONE', 'Europe/Moscow'),
      lat: point?.lat,
      lon: point?.lon,
    };
  }

  listDepartments(): Promise<Department[]> {
    return this.departments.find({ order: { sortOrder: 'ASC' } });
  }

  listCategories(): Promise<ServiceCategory[]> {
    return this.categories.find({ order: { sortOrder: 'ASC' } });
  }

  async getCategory(slug: string): Promise<ServiceCategory> {
    const category = await this.categories.findOne({
      where: { slug },
      relations: { items: true },
      order: { items: { sortOrder: 'ASC' } },
    });
    if (!category) throw new NotFoundException('Категория услуг не найдена');
    return category;
  }

  listCheckups(): Promise<CheckupPackage[]> {
    return this.checkups.find({ order: { sortOrder: 'ASC' } });
  }

  async getCheckup(slug: string): Promise<CheckupPackage> {
    const item = await this.checkups.findOne({ where: { slug } });
    if (!item) throw new NotFoundException('Программа не найдена');
    return item;
  }

  async listArticles(page = 1, limit = 4): Promise<Page<Omit<Article, 'content'>>> {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(Math.max(1, limit), 20);
    const [rows, total] = await this.articles.findAndCount({
      select: { id: true, slug: true, title: true, excerpt: true, publishedAt: true },
      order: { publishedAt: 'DESC' },
      skip: (safePage - 1) * safeLimit,
      take: safeLimit,
    });
    return { items: rows, total, page: safePage, pages: Math.max(1, Math.ceil(total / safeLimit)) };
  }

  async getArticle(slug: string): Promise<Article> {
    const article = await this.articles.findOne({ where: { slug } });
    if (!article) throw new NotFoundException('Статья не найдена');
    return article;
  }
}
