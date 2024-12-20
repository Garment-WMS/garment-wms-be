import { ApiProperty } from '@nestjs/swagger';
import { InventoryReportPlanType } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { FromToValidation } from 'src/common/decorator/validator/from-to-validation.decorator';
import { GapDayValidation } from 'src/common/decorator/validator/gaps-day.decorator';
import { MinDateCustom } from 'src/common/decorator/validator/min-date.decorator';
import { UniqueInArray } from 'src/common/decorator/validator/unique-property.decorator';
import { CreateInventoryReportPlanDetailDto } from './create-inventory-report-plan-detail.dto';

export class CreateInventoryReportPlanDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(InventoryReportPlanType)
  inventoryReportPlanType: InventoryReportPlanType;

  @ApiProperty()
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  @Transform(({ value }) => new Date(value).toISOString())
  @MinDateCustom()
  from: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  @Transform(({ value }) => new Date(value).toISOString())
  @MinDateCustom()
  @FromToValidation('from', {
    message: 'The "to" date must be greater than or equal to the "from" date',
  })
  @GapDayValidation('from', 4)
  to: Date;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @UniqueInArray(['materialVariantId', 'productVariantId'])
  @Type(() => CreateInventoryReportPlanDetailDto)
  inventoryReportPlanDetails: CreateInventoryReportPlanDetailDto[];
}
