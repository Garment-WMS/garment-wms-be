import { PartialType } from '@nestjs/swagger';
import { CreateMaterialExportReceiptDetailDto } from './create-material-export-receipt-detail.dto';

export class UpdateMaterialExportReceiptDetailDto extends PartialType(CreateMaterialExportReceiptDetailDto) {}
