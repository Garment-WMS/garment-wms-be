import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { UpdateImportRequestDto } from './update-import-request.dto';

export enum ManagerAction {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export class ManagerProcessDto extends PickType(UpdateImportRequestDto, [
  'description',
  'rejectReason',
]) {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEnum(ManagerAction)
  action: string;
}
