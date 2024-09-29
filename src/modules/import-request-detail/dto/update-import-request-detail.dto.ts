import { PartialType } from '@nestjs/swagger';
import { CreateImportRequestDetailDto } from './create-import-request-detail.dto';

export class UpdateImportRequestDetailDto extends PartialType(CreateImportRequestDetailDto) {}
