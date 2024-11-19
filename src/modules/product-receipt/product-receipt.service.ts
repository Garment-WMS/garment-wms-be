import { Injectable } from '@nestjs/common';
import { CreateProductReceiptDto } from './dto/create-product-receipt.dto';
import { UpdateProductReceiptDto } from './dto/update-product-receipt.dto';

@Injectable()
export class ProductReceiptService {
  create(createProductReceiptDto: CreateProductReceiptDto) {
    return 'This action adds a new productReceipt';
  }

  findAll() {
    return `This action returns all productReceipt`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productReceipt`;
  }

  update(id: number, updateProductReceiptDto: UpdateProductReceiptDto) {
    return `This action updates a #${id} productReceipt`;
  }

  remove(id: number) {
    return `This action removes a #${id} productReceipt`;
  }
}
