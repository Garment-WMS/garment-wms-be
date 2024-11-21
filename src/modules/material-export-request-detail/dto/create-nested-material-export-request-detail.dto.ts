import { OmitType } from '@nestjs/swagger';
import { CreateMaterialExportRequestDetailDto } from './create-material-export-request-detail.dto';

export class CreateNestedMaterialExportRequestDetailDto extends OmitType(
  CreateMaterialExportRequestDetailDto,
  ['materialExportRequestId' as const],
) {}
