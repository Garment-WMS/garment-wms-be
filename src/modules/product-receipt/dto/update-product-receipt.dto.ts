import { PartialType } from '@nestjs/swagger';
import { CreateProductReceiptDto } from './create-product-receipt.dto';

export class UpdateProductReceiptDto extends PartialType(CreateProductReceiptDto) {}
