import { ApiProperty, PickType } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { UpdateImportRequestDto } from './update-import-request.dto';

export class ManagerProcessDto extends PickType(UpdateImportRequestDto, [
  'description',
  'rejectReason',
]) {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEnum($Enums.ImportRequestStatus)
  action: string;
}
