import { Injectable } from '@nestjs/common';
import { CreateImportReceiptDto } from './dto/create-import-receipt.dto';
import { UpdateImportReceiptDto } from './dto/update-import-receipt.dto';

@Injectable()
export class ImportReceiptService {
  create(createImportReceiptDto: CreateImportReceiptDto) {
    return 'This action adds a new importReceipt';
  }

  findAll() {
    return `This action returns all importReceipt`;
  }

  findOne(id: number) {
    return `This action returns a #${id} importReceipt`;
  }

  update(id: number, updateImportReceiptDto: UpdateImportReceiptDto) {
    return `This action updates a #${id} importReceipt`;
  }

  remove(id: number) {
    return `This action removes a #${id} importReceipt`;
  }
}
