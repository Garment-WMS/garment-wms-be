import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { $Enums, PoDeliveryStatus, Prisma, PrismaClient } from '@prisma/client';
import { isUUID } from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { ImportRequestService } from '../import-request/import-request.service';
import { InspectionReportService } from '../inspection-report/inspection-report.service';
import { InventoryStockService } from '../inventory-stock/inventory-stock.service';
import { MaterialReceiptService } from '../material-receipt/material-receipt.service';
import { PoDeliveryMaterialService } from '../po-delivery-material/po-delivery-material.service';
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
    private readonly poDeliveryDetailsService: PoDeliveryMaterialService,
  ) {}

  includeQuery: Prisma.ImportReceiptInclude = {
    materialReceipt: true,
    productReceipt: true,
    inspectionReport: {
      include: {
        inspectionRequest: {
          include: {
            importRequest: true,
          },
        },
      },
    },
  };

  async createMaterialReceipt(
    createImportReceiptDto: CreateImportReceiptDto,
    managerId: string,
  ) {
    const importRequest = await this.validateImportRequest(
      createImportReceiptDto.importRequestId,
    );
    const inspectionReport =
      await this.inspectionReportService.findUniqueByRequestId(
        importRequest.id,
      );

    if (!inspectionReport) {
      return apiFailed(HttpStatus.NOT_FOUND, 'Inspection Report not found');
    }
    console.log(managerId);
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
          id: inspectionReport.inspectionRequest.importRequest.warehouseStaffId,
        },
      },
      code: createImportReceiptDto.code,
      status: $Enums.ImportReceiptStatus.IMPORTING,
      type: 'MATERIAL',
      note: createImportReceiptDto.note,
      startedAt: createImportReceiptDto.startAt,
      finishedAt: createImportReceiptDto.finishAt,
    };

    // this.validateMaterialReceipt(
    //   inspectionReport.inspectionReportDetail,
    //   createImportReceiptDto.materialReceipts,
    // );

    const result = await this.prismaService.$transaction(
      async (prismaInstance: PrismaService) => {
        const importReceipt = await prismaInstance.importReceipt.create({
          data: importReceiptInput,
        });
        if (importReceipt) {
          const result =
            await this.materialReceiptService.createMaterialReceipts(
              importReceipt.id,
              inspectionReport.inspectionReportDetail,
              importRequest.poDeliveryId,
              prismaInstance,
              // createImportReceiptDto.materialReceipts,
            );

          await this.poDeliveryService.updatePoDeliveryMaterialStatus(
            importRequest.poDeliveryId,
            PoDeliveryStatus.FINISHED,
            prismaInstance,
          );

          let poDeliveryExtra;
          //Compare number of imported materials with number of approved material
          for (let i = 0; i < result.length; i++) {
            await this.prismaService.poDeliveryDetail.updateMany({
              where: {
                AND: [
                  {
                    poDeliveryId: importRequest.poDeliveryId,
                  },
                  {
                    materialPackageId: result[i].materialPackageId,
                  },
                ],
              },
              data: {
                actualImportQuantity: result[i].quantityByPack,
              },
            });
            //Create the extra PO delivery for the rejected material
            //Can use job queue to handle this
            let poDelivery: any = importRequest.poDelivery;
            let poDeliveryDetail = poDelivery.poDeliveryDetail as any;
            let expectedImportQuantity = poDeliveryDetail.find(
              (detail) =>
                detail.materialPackageId === result[i].materialPackageId,
            ).quantityByPack;
            if (result[i].quantityByPack !== expectedImportQuantity) {
              if (!poDeliveryExtra) {
                poDeliveryExtra = await this.poDeliveryService.createPoDelivery(
                  {
                    purchaseOrderId: importRequest.poDelivery.purchaseOrderId,
                    isExtra: true,
                    status: PoDeliveryStatus.PENDING,
                  },
                  prismaInstance,
                );
              }
              console.log('poDeliveryExtra', result[i].quantityByPack);
              console.log('expectedImportQuantity', expectedImportQuantity);
              await this.poDeliveryDetailsService.createPoDeliveryMaterial(
                {
                  poDelivery: {
                    connect: { id: poDeliveryExtra.id },
                  },
                  materialPackage: {
                    connect: { id: result[i].materialPackageId },
                  },
                  quantityByPack:
                    expectedImportQuantity - result[i].quantityByPack,
                  totalAmount: 0,
                },
                poDeliveryExtra.id,
                result[i].materialPackageId,
                prismaInstance,
              );
            }
          }

          //Update import request status to Approved
          await this.importRequestService.updateImportRequestStatus(
            inspectionReport.inspectionRequest.importRequestId,
            $Enums.ImportRequestStatus.IMPORTING,
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

    if (importRequest.status !== $Enums.ImportRequestStatus.INSPECTED) {
      throw new BadRequestException(
        'Import receipt cannot be created. The import request must be inspected before creating an import receipt.',
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
    const importReceipt: any = await this.findUnique(importReceiptId);

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
            await this.materialReceiptService.updateMaterialReceiptStatus(
              detail.id,
              $Enums.MaterialReceiptStatus.AVAILABLE,
              prismaInstance,
            );
            await this.inventoryStockService.updateMaterialStock(
              detail.materialPackageId,
              detail.quantityByPack,
              prismaInstance,
            );
            await this.importRequestService.updateImportRequestStatus(
              importReceipt.inspectionReport.inspectionRequest.importReqeuestId,
              $Enums.ImportRequestStatus.IMPORTED,
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

  validateMaterialReceipt(inspectionReportDetail: any, materialReceipts: any) {}
}
