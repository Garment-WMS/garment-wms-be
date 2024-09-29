import { PartialType } from '@nestjs/swagger';
import { CreateImportRequestDto } from './create-import-request.dto';

export class UpdateImportRequestDto extends PartialType(CreateImportRequestDto) {}
