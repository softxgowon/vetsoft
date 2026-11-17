import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';

@ApiTags('catalog')
@Controller()
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}

  @Get('clinic')
  clinic() {
    return this.catalog.clinic();
  }

  @Get('departments')
  departments() {
    return this.catalog.listDepartments();
  }

  @Get('service-categories')
  categories() {
    return this.catalog.listCategories();
  }

  @Get('service-categories/:slug')
  category(@Param('slug') slug: string) {
    return this.catalog.getCategory(slug);
  }

  @Get('checkups')
  checkups() {
    return this.catalog.listCheckups();
  }

  @Get('checkups/:slug')
  checkup(@Param('slug') slug: string) {
    return this.catalog.getCheckup(slug);
  }

  @Get('articles')
  articles(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number, @Query('limit', new DefaultValuePipe(4), ParseIntPipe) limit: number) {
    return this.catalog.listArticles(page, limit);
  }

  @Get('articles/:slug')
  article(@Param('slug') slug: string) {
    return this.catalog.getArticle(slug);
  }
}
