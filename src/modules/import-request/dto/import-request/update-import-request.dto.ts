import { OmitType, PartialType } from '@nestjs/swagger';
import { UpdateImportRequestDetailDto } from '../import-request-detail/update-import-request-detail.dto';
import { CreateImportRequestDto } from './create-import-request.dto';

export class UpdateImportRequestDto extends PartialType(
  OmitType(CreateImportRequestDto, ['importRequestDetails']),
) {
  importRequestDetails: UpdateImportRequestDetailDto[];
}
