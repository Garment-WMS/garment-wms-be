import { Injectable } from '@nestjs/common';
import { CreateInventoryReportDto } from './dto/create-inventory-report.dto';
import { UpdateInventoryReportDto } from './dto/update-inventory-report.dto';

@Injectable()
export class InventoryReportService {
  create(createInventoryReportDto: CreateInventoryReportDto) {
    return 'This action adds a new inventoryReport';
  }

  async findAll() {
    return `This action returns all inventoryReport`;
  }

  findOne(id: number) {
    return `This action returns a #${id} inventoryReport`;
  }

  update(id: number, updateInventoryReportDto: UpdateInventoryReportDto) {
    return `This action updates a #${id} inventoryReport`;
  }

  remove(id: number) {
    return `This action removes a #${id} inventoryReport`;
  }
}
