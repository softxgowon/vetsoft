import { PartialType } from '@nestjs/mapped-types';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Max, MaxLength, Min, MinLength } from 'class-validator';
import { Gender, Species } from '../../common/enums';

export class CreatePetDto {
  @IsString()
  @MinLength(1)
  @MaxLength(60)
  name: string;

  @IsEnum(Species)
  species: Species;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  breed?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsDateString({ strict: true })
  birthDate?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(999)
  weightKg?: number;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  chipNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;

  // владельца может указать только персонал клиники
  @IsOptional()
  @IsUUID()
  ownerId?: string;
}

export class UpdatePetDto extends PartialType(CreatePetDto) {}
