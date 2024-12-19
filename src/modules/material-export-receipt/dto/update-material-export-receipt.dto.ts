import { PartialType } from '@nestjs/swagger';
import { CreateMaterialExportReceiptDto } from './create-material-export-receipt.dto';

export class UpdateMaterialExportReceiptDto extends PartialType(CreateMaterialExportReceiptDto) {}
