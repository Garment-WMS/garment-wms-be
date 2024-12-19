import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { UpdateMaterialExportRequestDetailDto } from 'src/modules/material-export-request-detail/dto/update-material-export-request-detail.dto';
import { CreateMaterialExportRequestDto } from './create-material-export-request.dto';

export class UpdateMaterialExportRequestDto extends PartialType(
  OmitType(CreateMaterialExportRequestDto, ['materialExportRequestDetail']),
) {
  @ApiProperty({
    required: true,
    type: 'array',
    items: {
      type: 'object',
      properties: {
        materialId: { type: 'string', format: 'uuid' },
        quantityByUom: { type: 'number' },
      },
      required: ['materialId', 'quantityByUom'],
    },
  })
  @ValidateNested({
    each: true,
  })
  @IsArray()
  materialExportRequestDetail?: UpdateMaterialExportRequestDetailDto[];
}
