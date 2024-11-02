import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UniqueInArray } from 'src/common/decorator/validator/unique-property.decorator';
import { CreateInventoryReportPlanDetailDto } from './create-inventory-report-plan-detail.dto';

export class CreateInventoryReportPlanDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  @Transform(({ value }) => new Date(value).toISOString())
  from: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  @Transform(({ value }) => new Date(value).toISOString())
  to: Date;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @UniqueInArray(['materialPackageId', 'productIdSizeId'])
  @Type(() => CreateInventoryReportPlanDetailDto)
  inventoryReportPlanDetails: CreateInventoryReportPlanDetailDto[];
}
