import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class ReassignMaterialExportRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  warehouseStaffId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  materialExportRequestId: string;
}
