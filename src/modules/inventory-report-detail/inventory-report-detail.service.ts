import { InjectQueue } from '@nestjs/bullmq';
import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Queue } from 'bullmq';
import { isUUID } from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';
import { apiSuccess } from 'src/common/dto/api-response';
import { CreateReceiptAdjustmentDto } from '../receipt-adjustment/dto/create-receipt-adjustment.dto';
import { CreateInventoryReportDetailDto } from './dto/create-inventory-report-detail.dto';
import { RecordInventoryReportDetail } from './dto/record-inventory-report-detail.dto';
import { UpdateInventoryReportDetailDto } from './dto/update-inventory-report-detail.dto';

@Injectable()
export class InventoryReportDetailService {
  constructor(
    private readonly prismaService: PrismaService,
    @InjectQueue('receipt-adjustment')
    private readonly receiptAdjustQueue: Queue,
  ) {}

  async create(
    createInventoryReportDetailDto: CreateInventoryReportDetailDto[],
    prismaInstance: PrismaClient = this.prismaService,
  ) {
    const result = await prismaInstance.inventoryReportDetail.createMany({
      data: createInventoryReportDetailDto,
    });
    return result;
  }

  async handleRecordInventoryReportDetail(
    id: string,
    recordInventoryReportDetail: RecordInventoryReportDetail,
  ) {
    const inventoryReportDetail = await this.findById(id);
    if (!inventoryReportDetail) {
      throw new Error('Inventory Report Detail not found');
    }
    if (
      inventoryReportDetail.recoredAt &&
      inventoryReportDetail.actualQuantity
    ) {
      throw new Error('Inventory Report Detail already recorded');
    }
    const result = await this.prismaService.inventoryReportDetail.update({
      where: {
        id,
        recoredAt: new Date(),
      },
      include: {},
      data: recordInventoryReportDetail,
    });

    if (result.actualQuantity !== inventoryReportDetail.expectedQuantity) {
      const createReceiptAdjustmentDto: CreateReceiptAdjustmentDto = {
        inventoryReportDetailId: id,
        beforeAdjustQuantity: inventoryReportDetail.expectedQuantity,
        afterAdjustQuantity: result.actualQuantity,
        reason: recordInventoryReportDetail.note,
      };
      await this.receiptAdjustQueue.add(
        'create-receipt-adjustment',
        createReceiptAdjustmentDto,
      );
    }

    if (!result) {
      throw new Error('Record Inventory Report Detail failed');
    }
    return apiSuccess(
      HttpStatus.OK,
      result,
      'Record Inventory Report Detail successfully',
    );
  }

  async findAll() {
    return this.prismaService.inventoryReportDetail.findMany({
      include: {
        ReceiptAdjustment: true,
      },
    });
  }

  findById(id: string) {
    if (!isUUID(id)) {
      throw new Error('Invalid id');
    }
    return this.prismaService.inventoryReportDetail.findUnique({
      where: {
        id,
      },
    });
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
