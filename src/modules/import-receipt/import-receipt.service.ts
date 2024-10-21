import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { $Enums, PoDeliveryStatus, Prisma, PrismaClient } from '@prisma/client';
import { isUUID } from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { ImportRequestService } from '../import-request/import-request.service';
import { InspectionReportService } from '../inspection-report/inspection-report.service';
import { InventoryStockService } from '../inventory-stock/inventory-stock.service';
import { MaterialReceiptService } from '../material-receipt/material-receipt.service';
import { PoDeliveryService } from '../po-delivery/po-delivery.service';
import { CreateImportReceiptDto } from './dto/create-import-receipt.dto';
import { UpdateImportReceiptDto } from './dto/update-import-receipt.dto';

@Injectable()
export class ImportReceiptService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly materialReceiptService: MaterialReceiptService,
    private readonly inspectionReportService: InspectionReportService,
    private readonly poDeliveryService: PoDeliveryService,
    private readonly inventoryStockService: InventoryStockService,
    private readonly importRequestService: ImportRequestService,
  ) {}

  includeQuery: Prisma.ImportReceiptInclude = {
    materialReceipt: true,
    productReceipt: true,
  };

  async createMaterialReceipt(
    createImportReceiptDto: CreateImportReceiptDto,
    managerId: string,
  ) {
    const importRequest = await this.validateImportRequest(
      createImportReceiptDto.importRequestId,
    );

    console.log('importRequest', importRequest);

    const inspectionReport =
      await this.inspectionReportService.findUniqueByRequestId(
        importRequest.id,
      );

    if (!inspectionReport) {
      return apiFailed(HttpStatus.NOT_FOUND, 'Inspection Report not found');
    }
    const importReceiptInput: Prisma.ImportReceiptCreateInput = {
      inspectionReport: {
        connect: {
          id: inspectionReport.id,
        },
      },
      warehouseManager: {
        connect: {
          id: managerId,
        },
      },
      warehouseStaff: {
        connect: {
          id: createImportReceiptDto.warehouseStaffId,
        },
      },
      code: createImportReceiptDto.code,
      status: $Enums.ImportReceiptStatus.IMPORTING,
      type: 'MATERIAL',
      note: createImportReceiptDto.note,
      startedAt: createImportReceiptDto.startAt,
      finishedAt: createImportReceiptDto.finishAt,
    };

    const result = await this.prismaService.$transaction(
      async (prismaInstance: PrismaClient) => {
        const importReceipt = await prismaInstance.importReceipt.create({
          data: importReceiptInput,
        });
        if (importReceipt) {
          await this.materialReceiptService.createMaterialReceipts(
            importReceipt.id,
            inspectionReport.inspectionReportDetail,
            prismaInstance,
          );

          await this.poDeliveryService.updatePoDeliveryMaterialStatus(
            importRequest.poDeliveryId,
            PoDeliveryStatus.FINISHED,
            prismaInstance,
          );

          //Update import request status to Approved
          await this.importRequestService.updateImportRequestStatus(
            inspectionReport.inspectionRequest.importRequestId,
            $Enums.ImportRequestStatus.APPROVED,
            prismaInstance,
          );
        }
        return importReceipt;
      },
    );
    if (result) {
      return apiSuccess(
        HttpStatus.CREATED,
        result,
        'Create import receipt successfully',
      );
    }
    return apiFailed(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'Create import receipt failed',
    );
  }

  async validateImportRequest(importRequestId: string) {
    const importRequest =
      await this.importRequestService.findUnique(importRequestId);
    if (!importRequest) {
      throw new BadRequestException('Import Request not found');
    }

    if (importRequest.status !== $Enums.ImportRequestStatus.APPROVED) {
      throw new BadRequestException(
        'Cannot create import receipt, Import Request status is not valid',
      );
    }
    return importRequest;
  }

  updateImportReceiptStatus(
    importReceiptId: string,
    status: $Enums.ImportReceiptStatus,
  ) {
    if (
      status === $Enums.ImportReceiptStatus.IMPORTED
      // ||
      // status === $Enums.ReceiptStatus.REJECTED
    ) {
      return this.prismaService.importReceipt.update({
        where: { id: importReceiptId },
        data: {
          status,
          finishedAt: new Date(),
        },
      });
    }

    return this.prismaService.importReceipt.update({
      where: { id: importReceiptId },
      data: {
        status,
      },
    });
  }

  async finishImportReceipt(importReceiptId: string) {
    const importReceipt = await this.findUnique(importReceiptId);
    if (!importReceipt) {
      return apiFailed(HttpStatus.NOT_FOUND, 'Import Receipt not found');
    }

    if (importReceipt.status !== $Enums.ImportReceiptStatus.IMPORTING) {
      return apiFailed(
        HttpStatus.BAD_REQUEST,
        'Cannot finish import receipt, Import Receipt status is not valid',
      );
    }

    const result = this.prismaService.$transaction(
      async (prismaInstance: PrismaClient) => {
        if (importReceipt.materialReceipt) {
          importReceipt.materialReceipt.forEach(async (detail) => {
            await this.inventoryStockService.updateMaterialStock(
              detail.materialVariantId,
              detail.quantityByPack,
              prismaInstance,
            );
          });
        } else {
          throw new Error('Material Receipt not found');
        }

        const result = await this.updateImportReceiptStatus(
          importReceiptId,
          $Enums.ImportReceiptStatus.IMPORTED,
        );
        return result;
      },
    );

    if (result) {
      return apiSuccess(
        HttpStatus.OK,
        result,
        'Finish import receipt successfully',
      );
    }
    return apiFailed(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'Finish import receipt failed',
    );
  }

  findUnique(id: string) {
    if (!isUUID(id)) {
      throw new Error('Invalid UUID');
    }

    return this.prismaService.importReceipt.findUnique({
      where: { id },
      include: this.includeQuery,
    });
  }

  async findAll() {
    const result = await this.prismaService.importReceipt.findMany({
      include: this.includeQuery,
    });
    return apiSuccess(
      HttpStatus.OK,
      result,
      'Get all import receipt successfully',
    );
  }

  async findOne(id: string) {
    const importReceipt = await this.findUnique(id);
    if (!importReceipt) {
      return apiFailed(HttpStatus.NOT_FOUND, 'Import Receipt not found');
    }
    return apiSuccess(
      HttpStatus.OK,
      importReceipt,
      'Get import receipt successfully',
    );
  }

  update(id: number, updateImportReceiptDto: UpdateImportReceiptDto) {
    return `This action updates a #${id} importReceipt`;
  }

  remove(id: number) {
    return `This action removes a #${id} importReceipt`;
  }
}
