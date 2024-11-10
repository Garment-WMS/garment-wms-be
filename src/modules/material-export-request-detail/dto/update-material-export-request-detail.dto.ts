import { PartialType } from '@nestjs/swagger';
import { CreateMaterialExportRequestDetailDto } from './create-material-export-request-detail.dto';

export class UpdateMaterialExportRequestDetailDto extends PartialType(CreateMaterialExportRequestDetailDto) {}
