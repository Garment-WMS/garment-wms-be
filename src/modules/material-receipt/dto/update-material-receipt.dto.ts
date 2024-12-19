import { PartialType } from '@nestjs/swagger';
import { CreateMaterialReceiptDto } from './create-material-receipt.dto';

export class UpdateMaterialReceiptDto extends PartialType(CreateMaterialReceiptDto) {}
