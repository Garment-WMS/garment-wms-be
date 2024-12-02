import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ProductionDepartmentCreateReturnImportRequestDto {
  @ApiProperty({ required: false, type: 'string', format: 'uuid' })
  @IsUUID()
  materialExportRequestId: string;
}
