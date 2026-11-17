import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../common/decorators/auth.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthUser } from '../common/types';
import { CreatePetDto, UpdatePetDto } from './dto/pet.dto';
import { PetsService } from './pets.service';

@ApiTags('pets')
@Controller('pets')
@Auth()
export class PetsController {
  constructor(private readonly pets: PetsService) {}

  @Get()
  list(@CurrentUser() user: AuthUser, @Query('search') search?: string) {
    return this.pets.list(user, search);
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreatePetDto) {
    return this.pets.create(user, dto);
  }

  @Get(':id')
  getOne(@CurrentUser() user: AuthUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.pets.getOne(user, id);
  }

  @Patch(':id')
  update(@CurrentUser() user: AuthUser, @Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdatePetDto) {
    return this.pets.update(user, id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@CurrentUser() user: AuthUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.pets.remove(user, id);
  }
}
