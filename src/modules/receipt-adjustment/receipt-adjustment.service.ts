import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateReceiptAdjustmentDto } from './dto/create-receipt-adjustment.dto';
import { UpdateReceiptAdjustmentDto } from './dto/update-receipt-adjustment.dto';

@Injectable()
export class ReceiptAdjustmentService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createReceiptAdjustmentDto: CreateReceiptAdjustmentDto) {
    const createReceiptAdjustmentInput: Prisma.ReceiptAdjustmentCreateInput = {
      beforeAdjustQuantity: createReceiptAdjustmentDto.beforeAdjustQuantity,
      afterAdjustQuantity: createReceiptAdjustmentDto.afterAdjustQuantity,
      adjustedAt: new Date(),
      inventoryReportDetail: {
        connect: { id: createReceiptAdjustmentDto.inventoryReportDetailId },
      },
    };

    return this.prismaService.receiptAdjustment.create({
      data: createReceiptAdjustmentInput,
    });
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
