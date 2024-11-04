import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateInventoryReportDetailDto } from './dto/create-inventory-report-detail.dto';
import { UpdateInventoryReportDetailDto } from './dto/update-inventory-report-detail.dto';

@Injectable()
export class InventoryReportDetailService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createInventoryReportDetailDto: CreateInventoryReportDetailDto[],
    prismaInstance: PrismaClient = this.prismaService,
  ) {
    const result = await prismaInstance.inventoryReportDetail.createMany({
      data: createInventoryReportDetailDto,
    });

    console.log(result);

    return result;
  }

  findAll() {
    return `This action returns all inventoryReportDetail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} inventoryReportDetail`;
  }

  update(
    id: number,
    updateInventoryReportDetailDto: UpdateInventoryReportDetailDto,
  ) {
    return `This action updates a #${id} inventoryReportDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} inventoryReportDetail`;
  }
}
