import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { CreateMaterialExportRequestDetailDto } from './create-material-export-request-detail.dto';

export class UpdateMaterialExportRequestDetailDto extends PartialType(
  CreateMaterialExportRequestDetailDto,
) {
  @ApiProperty({ required: true, type: 'string', format: 'uuid' })
  @IsUUID()
  id: string;
}
