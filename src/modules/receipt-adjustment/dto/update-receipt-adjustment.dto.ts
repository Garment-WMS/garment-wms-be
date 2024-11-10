import { PartialType } from '@nestjs/swagger';
import { CreateReceiptAdjustmentDto } from './create-receipt-adjustment.dto';

export class UpdateReceiptAdjustmentDto extends PartialType(CreateReceiptAdjustmentDto) {}
