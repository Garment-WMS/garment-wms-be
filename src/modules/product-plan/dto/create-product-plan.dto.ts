import { $Enums } from '.prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinDate,
  MinLength,
} from 'class-validator';
import { IsValidYear } from 'src/common/decorator/is-valid-year.decorator';

export class CreateProductPlanDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  factoryDirectorId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsValidYear()
  year: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  code: string;

  @ApiProperty({ required: false })
  @IsEnum($Enums.ProductionStatus)
  @IsOptional()
  status?: $Enums.ProductionStatus;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsDateString()
  @MinDate(new Date(), { message: 'expectedStartDate must not be in the past' })
  expectedStartDate: Date;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsDateString()
  @MinDate(new Date(), { message: 'expectedEndDate must not be in the past' })
  expectedEndDate: Date;
}
