import { PartialType } from '@nestjs/swagger';
import { CreateMaterialExportRequestDto } from './create-material-export-request.dto';

export class UpdateMaterialExportRequestDto extends PartialType(CreateMaterialExportRequestDto) {}
