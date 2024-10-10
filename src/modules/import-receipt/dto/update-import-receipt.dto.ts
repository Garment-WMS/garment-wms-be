import { PartialType } from '@nestjs/swagger';
import { CreateImportReceiptDto } from './create-import-receipt.dto';

export class UpdateImportReceiptDto extends PartialType(CreateImportReceiptDto) {}
