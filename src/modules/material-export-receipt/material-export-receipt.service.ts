import { Injectable } from '@nestjs/common';
import { CreateMaterialExportReceiptDto } from './dto/create-material-export-receipt.dto';
import { UpdateMaterialExportReceiptDto } from './dto/update-material-export-receipt.dto';

@Injectable()
export class MaterialExportReceiptService {
  create(createMaterialExportReceiptDto: CreateMaterialExportReceiptDto) {
    return 'This action adds a new materialExportReceipt';
  }

  findAll() {
    return `This action returns all materialExportReceipt`;
  }

  findOne(id: number) {
    return `This action returns a #${id} materialExportReceipt`;
  }

  update(id: number, updateMaterialExportReceiptDto: UpdateMaterialExportReceiptDto) {
    return `This action updates a #${id} materialExportReceipt`;
  }

  remove(id: number) {
    return `This action removes a #${id} materialExportReceipt`;
  }
}
