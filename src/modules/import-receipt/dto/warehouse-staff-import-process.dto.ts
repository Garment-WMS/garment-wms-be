import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
export enum WarehouseStaffImportProcessAction {
  IMPORTING = 'IMPORTING',
  IMPORTED = 'IMPORTED',
}
export class WarehouseStaffImportProcessDto {
  @ApiProperty({ required: true })
  @IsEnum(WarehouseStaffImportProcessAction)
  @IsNotEmpty()
  action: WarehouseStaffImportProcessAction;
}
