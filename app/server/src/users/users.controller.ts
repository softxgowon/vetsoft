import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../common/decorators/auth.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums';
import { AuthUser } from '../common/types';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  @Auth()
  me(@CurrentUser() user: AuthUser) {
    return this.users.getPublic(user.id);
  }

  @Patch('me')
  @Auth()
  updateMe(@CurrentUser() user: AuthUser, @Body() dto: UpdateProfileDto) {
    return this.users.updateProfile(user.id, dto);
  }

  @Post('staff')
  @Auth(Role.Admin)
  createStaff(@Body() dto: CreateStaffDto) {
    return this.users.createStaff(dto);
  }
}
