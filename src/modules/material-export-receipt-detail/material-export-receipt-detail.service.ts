import { Injectable } from '@nestjs/common';
import { CreateMaterialExportReceiptDetailDto } from './dto/create-material-export-receipt-detail.dto';
import { UpdateMaterialExportReceiptDetailDto } from './dto/update-material-export-receipt-detail.dto';

@Injectable()
export class MaterialExportReceiptDetailService {
  create(createMaterialExportReceiptDetailDto: CreateMaterialExportReceiptDetailDto) {
    return 'This action adds a new materialExportReceiptDetail';
  }

  findAll() {
    return `This action returns all materialExportReceiptDetail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} materialExportReceiptDetail`;
  }

  update(id: number, updateMaterialExportReceiptDetailDto: UpdateMaterialExportReceiptDetailDto) {
    return `This action updates a #${id} materialExportReceiptDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} materialExportReceiptDetail`;
  }
}
