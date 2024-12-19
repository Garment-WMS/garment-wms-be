import { ApiProperty } from '@nestjs/swagger';
import { InventoryReportPlanType, RoleCode } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { FromToValidation } from 'src/common/decorator/validator/from-to-validation.decorator';
import { GapDayValidation } from 'src/common/decorator/validator/gaps-day.decorator';
import { MinDateCustom } from 'src/common/decorator/validator/min-date.decorator';
import { IsUserRoleExist } from 'src/modules/user/validator/is-user-of-role-exist.validator';

export class CreateOverAllInventoryReportPlanDto {
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
  @Type(() => WarehouseStaffList)
  staffList: WarehouseStaffList[];
}

class WarehouseStaffList {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  @IsUserRoleExist(RoleCode.WAREHOUSE_STAFF)
  warehouseStaffId: string;
}
