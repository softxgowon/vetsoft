import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class CreateRecordDto {
  @IsOptional()
  @IsDateString()
  visitedAt?: string;

  @IsOptional()
  @IsUUID()
  doctorId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  complaint?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(300)
  diagnosis: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  treatment?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  recommendations?: string;
}

export class LabItemDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(50)
  value: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  unit?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  reference?: string;
}

export class CreateLabResultDto {
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  title: string;

  @IsDateString({ strict: true })
  takenAt: string;

  @IsArray()
  @ArrayMaxSize(80)
  @ValidateNested({ each: true })
  @Type(() => LabItemDto)
  items: LabItemDto[];

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  conclusion?: string;
}

export class CreatePrescriptionDto {
  @IsOptional()
  @IsDateString({ strict: true })
  prescribedAt?: string;

  @IsOptional()
  @IsUUID()
  doctorId?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(200)
  medication: string;

  @IsString()
  @MaxLength(200)
  dosage: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  duration?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  instructions?: string;
}

export class CreateVaccinationDto {
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  vaccine: string;

  @IsDateString({ strict: true })
  vaccinatedAt: string;

  @IsOptional()
  @IsDateString({ strict: true })
  nextDueAt?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  batchNumber?: string;
}
