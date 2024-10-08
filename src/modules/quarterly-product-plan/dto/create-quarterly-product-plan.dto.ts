import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateQuarterlyProductPlanDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  annualProductionPlanId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(['Q1', 'Q2', 'Q3', 'Q4'])
  quarter: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum($Enums.ProductionStatus)
  status: $Enums.ProductionStatus;

  //   @ApiProperty({ required: false })
  //   @IsNotEmpty()
  //   @IsDateString()
  //   @MinDate(new Date(), { message: 'expectedStartDate must not be in the past' })
  //   expectedStartDate: Date;

  //   @ApiProperty({ required: false })
  //   @IsNotEmpty()
  //   @IsDateString()
  //   @MinDate(new Date(), { message: 'expectedEndDate must not be in the past' })
  //   expectedEndDate: Date;
}
