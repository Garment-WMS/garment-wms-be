import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateReceiptAdjustmentDto } from './dto/create-receipt-adjustment.dto';
import { UpdateReceiptAdjustmentDto } from './dto/update-receipt-adjustment.dto';

@Injectable()
export class ReceiptAdjustmentService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createReceiptAdjustmentDto: CreateReceiptAdjustmentDto) {
    const createReceiptAdjustmentInput: Prisma.ReceiptAdjustmentCreateInput = {
      warehouseManager: {
        connect: { id: createReceiptAdjustmentDto.warehouseManagerId },
      },
      materialReceipt: {
        connect: { id: createReceiptAdjustmentDto.materialReceiptId },
      },
      productReceipt: {
        connect: { id: createReceiptAdjustmentDto.productReceiptId },
      },
      beforeAdjustQuantity: createReceiptAdjustmentDto.beforeAdjustQuantity,
      afterAdjustQuantity: createReceiptAdjustmentDto.afterAdjustQuantity,
      adjustedAt: new Date(),
      inventoryReportDetail: {
        connect: { id: createReceiptAdjustmentDto.inventoryReportDetailId },
      },
    };

    console.log(CreateReceiptAdjustmentDto);

    const result = await this.prismaService.receiptAdjustment.create({
      data: createReceiptAdjustmentInput,
    });

    return result;
  }

  findAll() {
    return `This action returns all receiptAdjustment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} receiptAdjustment`;
  }

  update(id: number, updateReceiptAdjustmentDto: UpdateReceiptAdjustmentDto) {
    return `This action updates a #${id} receiptAdjustment`;
  }

  remove(id: number) {
    return `This action removes a #${id} receiptAdjustment`;
  }
}
