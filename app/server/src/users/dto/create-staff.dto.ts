import { IsEmail, IsIn, IsString, MaxLength, MinLength } from 'class-validator';
import { Role } from '../../common/enums';

export class CreateStaffDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(120)
  fullName: string;

  @IsIn([Role.Doctor, Role.Admin])
  role: Role.Doctor | Role.Admin;
}
