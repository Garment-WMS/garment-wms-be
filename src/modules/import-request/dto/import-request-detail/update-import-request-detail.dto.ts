import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ArrayUnique, IsOptional, IsUUID } from 'class-validator';
import { CreateImportRequestDetailDto } from './create-import-request-detail.dto';

export class UpdateImportRequestDetailDto extends PartialType(
  CreateImportRequestDetailDto,
  {
    skipNullProperties: true,
  },
) {
  @ApiProperty()
  @IsUUID()
  @IsOptional()
  @ArrayUnique()
  id: string;
}
