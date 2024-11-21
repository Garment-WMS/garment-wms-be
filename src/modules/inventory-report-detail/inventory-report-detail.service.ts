import { InjectQueue } from '@nestjs/bullmq';
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaClient } from '@prisma/client';
import { Queue } from 'bullmq';
import { isUUID } from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';
import { apiSuccess } from 'src/common/dto/api-response';
import { MaterialReceiptService } from '../material-receipt/material-receipt.service';
import { CreateReceiptAdjustmentDto } from '../receipt-adjustment/dto/create-receipt-adjustment.dto';
import { CreateInventoryReportDetailDto } from './dto/create-inventory-report-detail.dto';
import { UpdateInventoryReportDetailDto } from './dto/update-inventory-report-detail.dto';
import { WarehouseManagerApprovalInventoryReportDetailDto } from './dto/warehouse-manager-approval-inventory-report-detail.dto';
import { WarehouseStaffApprovalInventoryReportDetailDto } from './dto/warehouse-staff-approval-inventory-report-detail.dto';
import { ProductReceiptService } from '../product-receipt/product-receipt.service';

@Injectable()
export class InventoryReportDetailService {
  constructor(
    private readonly prismaService: PrismaService,
    @InjectQueue('receipt-adjustment')
    private readonly receiptAdjustQueue: Queue,
    private readonly eventEmitter: EventEmitter2,
    private readonly materialReceiptService: MaterialReceiptService,
    private readonly productReceiptService: ProductReceiptService,
  ) {}

  isInventoryReportDetailExist(value: string) {
    return this.findById(value);
  }

  async create(
    createInventoryReportDetailDto: CreateInventoryReportDetailDto[],
    prismaInstance: PrismaClient = this.prismaService,
  ) {
    const result = await prismaInstance.inventoryReportDetail.createMany({
      data: createInventoryReportDetailDto,
    });
    return result;
  }

  async handleApprovalInventoryReportDetail(
    inventoryReportDetailId: string,
    inventoryRecordDetail: WarehouseManagerApprovalInventoryReportDetailDto,
    warehouseManagerId: string,
  ) {
    const inventoryReportDetail = await this.findById(inventoryReportDetailId);
    if (!inventoryReportDetail) {
      throw new BadRequestException('Inventory Report Detail not found');
    }

    if (
      inventoryReportDetail.inventoryReport.warehouseManagerId !==
      warehouseManagerId
    ) {
      throw new BadRequestException(
        'You are not allowed to record this inventory report detail',
      );
    }

    if (inventoryReportDetail.managerQuantityConfirm) {
      throw new BadRequestException('Inventory Report Detail already recorded');
    }
    const result = await this.prismaService.inventoryReportDetail.update({
      where: {
        id: inventoryReportDetailId,
      },
      data: {
        managerQuantityConfirm: inventoryRecordDetail.managerQuantityConfirm,
        warehouseManagerNote: inventoryRecordDetail?.note,
      },
    });

    if (!result) {
      throw new Error('Record Inventory Report Detail failed');
    }

    if (
      result.managerQuantityConfirm !== inventoryReportDetail.expectedQuantity
    ) {
      if (result.materialReceiptId) {
        await this.materialReceiptService.updateMaterialReceiptQuantity(
          result.materialReceiptId,
          result.managerQuantityConfirm,
        );
      }

      if (result.productReceiptId) {
        await this.productReceiptService.updateProductReceiptQuantity(
          result.productReceiptId,
          result.managerQuantityConfirm,
        );
      }

      const createReceiptAdjustmentDto: CreateReceiptAdjustmentDto = {
        warehouseManagerId: warehouseManagerId,
        materialReceiptId: inventoryReportDetail.materialReceiptId,
        productReceiptId: inventoryReportDetail.productReceiptId,
        inventoryReportDetailId: result.id,
        beforeAdjustQuantity: inventoryReportDetail.expectedQuantity,
        afterAdjustQuantity: result.managerQuantityConfirm,
        reason: inventoryRecordDetail.note,
      };
      await this.receiptAdjustQueue.add(
        'create-receipt-adjustment',
        createReceiptAdjustmentDto,
      );
    }

    return result;
  }

  async handleRecordInventoryReportDetail(
    id: string,
    recordInventoryReportDetail: WarehouseStaffApprovalInventoryReportDetailDto,
    warehouseStaffId: string,
    prismaInstance: PrismaService = this.prismaService,
  ) {
    const inventoryReportDetail = await this.findById(id);
    if (!inventoryReportDetail) {
      throw new BadRequestException('Inventory Report Detail not found');
    }

    if (
      inventoryReportDetail.inventoryReport.warehouseStaffId !==
      warehouseStaffId
    ) {
      throw new BadRequestException(
        'You are not allowed to record this inventory report detail',
      );
    }

    if (
      inventoryReportDetail.recoredAt &&
      inventoryReportDetail.actualQuantity
    ) {
      throw new BadRequestException('Inventory Report Detail already recorded');
    }
    const result = await this.prismaService.inventoryReportDetail.update({
      where: {
        id,
      },
      data: {
        actualQuantity: recordInventoryReportDetail.actualQuantity,
        warehouseStaffNote: recordInventoryReportDetail?.note,
        recoredAt: new Date(),
      },
    });

    if (!result) {
      throw new Error('Record Inventory Report Detail failed');
    }
    return result;
  }

  async findAll() {
    return this.prismaService.inventoryReportDetail.findMany({
      include: {
        receiptAdjustment: true,
      },
    });
  }

  // async handleInventoryReportDetailApproval(
  //   inventoryReportDetailId: string,
  //   approvalInventoryReportDetailDto: ApprovalInventoryReportDetailDto,
  //   warehouseManagerId: string,
  // ) {
  //   const inventoryReportDetail = await this.findById(inventoryReportDetailId);
  //   if (!inventoryReportDetail) {
  //     throw new BadRequestException('Inventory Report Detail not found');
  //   }
  //   if (
  //     inventoryReportDetail.status !==
  //     InventoryReportDetailStatus.PENDING_APPROVAL
  //   ) {
  //     throw new BadRequestException(
  //       'Inventory Report Detail is not pending approval',
  //     );
  //   }

  //   if (
  //     inventoryReportDetail.inventoryReport.warehouseManagerId !==
  //     warehouseManagerId
  //   ) {
  //     throw new BadRequestException(
  //       'You are not allowed to approve this inventory report detail',
  //     );
  //   }

  //   if (
  //     approvalInventoryReportDetailDto.status ===
  //     InventoryReportDetailStatus.REJECTED
  //   ) {
  //     const result = await this.prismaService.inventoryReportDetail.update({
  //       where: {
  //         id: inventoryReportDetailId,
  //       },
  //       include: {},
  //       data: {
  //         status: InventoryReportDetailStatus.REJECTED,
  //       },
  //     });

  //     if (!result) {
  //       throw new Error('Reject Inventory Report Detail failed');
  //     }
  //     return apiSuccess(
  //       HttpStatus.OK,
  //       result,
  //       'Reject Inventory Report Detail successfully',
  //     );
  //   }

  //   const result = await this.prismaService.inventoryReportDetail.update({
  //     where: {
  //       id: inventoryReportDetailId,
  //     },
  //     include: {},
  //     data: {
  //       managerQuantityConfirm:
  //         approvalInventoryReportDetailDto.managerQuantityConfirm,
  //       status: InventoryReportDetailStatus.APPROVED,
  //     },
  //   });

  //   if (!result) {
  //     throw new Error('Approve Inventory Report Detail failed');
  //   }

  //   // await this.checkLastInventoryReport(
  //   //   inventoryReportDetail.inventoryReportId,
  //   // );

  //   return apiSuccess(
  //     HttpStatus.OK,
  //     result,
  //     'Approve Inventory Report Detail successfully',
  //   );
  // }

  findById(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid id');
    }
    return this.prismaService.inventoryReportDetail.findUnique({
      where: {
        id,
      },
      include: {
        inventoryReport: true,
        receiptAdjustment: true,
      },
    });
  }

  async findOne(id: string) {
    const result = await this.findById(id);
    if (!result) {
      throw new BadRequestException('Inventory Report Detail not found');
    }
    return apiSuccess(HttpStatus.OK, result, 'Inventory Report Detail found');
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

  async checkLastInventoryReport(inventoryReportId: string) {
    const isAllInventoryReportDetailRecorded =
      await this.prismaService.inventoryReportDetail.findMany({
        where: {
          inventoryReportId,
          recoredAt: null,
        },
      });
    if (isAllInventoryReportDetailRecorded.length > 0) {
      return false;
    }
    // await this.eventEmitter.emitAsync(
    //   'inventory-report.status',
    //   inventoryReportId,
    // );
    return true;
  }

  async checkLastApprovalInventoryReport(inventoryReportId: string) {
    const isAllInventoryReportDetailRecorded =
      await this.prismaService.inventoryReportDetail.findMany({
        where: {
          inventoryReportId,
          managerQuantityConfirm: null,
        },
      });
    if (isAllInventoryReportDetailRecorded.length > 0) {
      return false;
    }
    return true;
  }
}
