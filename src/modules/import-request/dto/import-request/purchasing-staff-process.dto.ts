import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { UpdateImportRequestDto } from './update-import-request.dto';

export enum PurchasingStaffAction {
  CANCELED = 'CANCELED',
}

export class PurchasingStaffProcessDto extends PickType(
  UpdateImportRequestDto,
  ['description', 'cancelReason'],
) {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEnum(PurchasingStaffAction)
  action: string;
}
