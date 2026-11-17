import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
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

  @IsOptional()
  @IsString()
  @Matches(/^[+\d][\d\s()-]{5,30}$/, { message: 'Некорректный номер телефона' })
  phone?: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(72)
  password: string;
}
