import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  $Enums,
  PoDeliveryStatus,
  Prisma,
  ProductionBatchStatus,
  RoleCode,
} from '@prisma/client';
import { isUUID } from 'class-validator';
import { importReceiptInclude } from 'prisma/prisma-include';
import { PrismaService } from 'prisma/prisma.service';
import { Constant } from 'src/common/constant/constant';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { DataResponse } from 'src/common/dto/data-response';
import { getPageMeta } from 'src/common/utils/utils';
import { AuthenUser } from '../auth/dto/authen-user.dto';
import { ImportRequestService } from '../import-request/import-request.service';
import { InspectionReportService } from '../inspection-report/inspection-report.service';
import { InventoryStockService } from '../inventory-stock/inventory-stock.service';
import { MaterialReceiptService } from '../material-receipt/material-receipt.service';
import { PoDeliveryMaterialService } from '../po-delivery-material/po-delivery-material.service';
import { PoDeliveryService } from '../po-delivery/po-delivery.service';
import { ProductReceiptService } from '../product-receipt/product-receipt.service';
import { ProductionBatchService } from '../production-batch/production-batch.service';
import { CreateTaskDto } from '../task/dto/create-task.dto';
import { TaskService } from '../task/task.service';
import { CreateImportReceiptDto } from './dto/create-import-receipt.dto';
import { UpdateImportReceiptDto } from './dto/update-import-receipt.dto';

@Injectable()
export class ImportReceiptService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly materialReceiptService: MaterialReceiptService,
    private readonly productReceiptService: ProductReceiptService,
    private readonly inspectionReportService: InspectionReportService,
    private readonly poDeliveryService: PoDeliveryService,
    private readonly inventoryStockService: InventoryStockService,
    private readonly importRequestService: ImportRequestService,
    private readonly poDeliveryDetailsService: PoDeliveryMaterialService,
    private readonly productionBatchService: ProductionBatchService,
    private readonly taskService: TaskService,
  ) {}

  findByQuery(query: any) {
    return this.prismaService.importReceipt.findFirst({
      where: query,
      include: importReceiptInclude,
    });
  }

  async createProductReceipt(
    createImportReceiptDto: CreateImportReceiptDto,
    managerId: string,
  ) {
    const importRequest = await this.validateImportRequest(
      createImportReceiptDto.importRequestId,
    );
    const inspectionReport =
      await this.inspectionReportService.findUniqueInspectedByRequestId(
        importRequest.id,
      );

    if (!inspectionReport) {
      return apiFailed(
        HttpStatus.NOT_FOUND,
        'Inspection report of this import request not found',
      );
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
          id: inspectionReport.inspectionRequest.importRequest.warehouseStaffId,
        },
      },
      code: createImportReceiptDto.code,
      status: $Enums.ImportReceiptStatus.IMPORTING,
      type: 'PRODUCT',
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
          const result = await this.productReceiptService.createProductReceipts(
            importReceipt.id,
            inspectionReport.inspectionReportDetail,
            importRequest.productionBatchId,
            prismaInstance,
            // createImportReceiptDto.materialReceipts,
          );

          await this.productionBatchService.updateStatus(
            importRequest.productionBatchId,
            ProductionBatchStatus.IMPORTING,
            prismaInstance,
          );

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
      try {
        await this.createTaskByImportReceipt(
          result.id,
          inspectionReport.inspectionRequest.importRequest.warehouseStaffId,
        );
      } catch (e) {
        Logger.error(e);
        throw new ConflictException('Can not create Task automatically');
      }

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

  async createMaterialReceipt(
    createImportReceiptDto: CreateImportReceiptDto,
    managerId: string,
  ) {
    const importRequest = await this.validateImportRequest(
      createImportReceiptDto.importRequestId,
    );
    const inspectionReport =
      await this.inspectionReportService.findUniqueInspectedByRequestId(
        importRequest.id,
      );

    if (!inspectionReport) {
      return apiFailed(
        HttpStatus.NOT_FOUND,
        'Inspection report of this import request not found',
      );
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
            //TODO: Can use job queue to handle this to avoid bottleneck issues
            let poDelivery: any = importRequest.poDelivery;
            //Has to cast to any because issue with includeQuery ( Typescript error not mine, if include raw still work )
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
      try {
        await this.createTaskByImportReceipt(
          result.id,
          inspectionReport.inspectionRequest.importRequest.warehouseStaffId,
        );
      } catch (e) {
        Logger.error(e);
        throw new ConflictException('Can not create Task automatically');
      }

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

  async createTaskByImportReceipt(
    importReceiptId: string,
    warehouseId: string,
  ) {
    const createTaskDto: CreateTaskDto = {
      taskType: 'IMPORT',
      importReceiptId: importReceiptId,
      warehouseStaffId: warehouseId,
      status: $Enums.TaskStatus.OPEN,
    };
    const task = await this.taskService.create(createTaskDto);
    return task;
  }

  async validateImportRequest(importRequestId: string) {
    const importRequest =
      await this.importRequestService.findUnique(importRequestId);
    if (!importRequest) {
      throw new BadRequestException('Import Request not found');
    }

    if (importRequest.status === $Enums.ImportRequestStatus.IMPORTED) {
      throw new BadRequestException(
        'Import receipt cannot be created. The import request has been imported before.',
      );
    }

    if (importRequest.status === $Enums.ImportRequestStatus.REJECTED) {
      throw new BadRequestException(
        'Import receipt cannot be created. The import request has been rejected.',
      );
    }

    if (importRequest.status === $Enums.ImportRequestStatus.CANCELED) {
      throw new BadRequestException(
        'Import receipt cannot be created. The import request has been canceled.',
      );
    }

    // if (importRequest.status === $Enums.ImportRequestStatus.APPROVED) {
    //   throw new BadRequestException(
    //     'Import receipt cannot be created. The import request has been approved.',
    //   );
    // }

    if (importRequest.status === $Enums.ImportRequestStatus.INSPECTING) {
      throw new BadRequestException(
        'Import receipt cannot be created. The import request is being inspected.',
      );
    }

    if (importRequest.status === $Enums.ImportRequestStatus.IMPORTING) {
      throw new BadRequestException(
        'Import receipt cannot be created. The import request is being imported.',
      );
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
    console.log('importReceipt', importReceipt);

    const result = await this.prismaService.$transaction(
      async (prismaInstance: PrismaService) => {
        if (importReceipt?.materialReceipt.length > 0) {
          console.log('materialReceipt', importReceipt.materialReceipt);
          for (const detail of importReceipt.materialReceipt) {
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
            if (
              !importReceipt?.inspectionReport?.inspectionRequest
                .importRequestId
            ) {
              throw new Error('Import Request not found');
            }
            await this.importRequestService.updateImportRequestStatus(
              importReceipt.inspectionReport.inspectionRequest.importRequestId,
              $Enums.ImportRequestStatus.IMPORTED,
              prismaInstance,
            );
          }
        } else if (importReceipt?.productReceipt.length > 0) {
          console.log('productReceipt', importReceipt.productReceipt);
          for (const detail of importReceipt.productReceipt) {
            await this.productReceiptService.updateProductReceiptStatus(
              detail.id,
              $Enums.ProductReceiptStatus.AVAILABLE,
              prismaInstance,
            );
            await this.inventoryStockService.updateProductStock(
              detail.productSizeId,
              detail.quantityByUom,
              prismaInstance,
            );

            if (
              !importReceipt?.inspectionReport?.inspectionRequest
                .importRequestId
            ) {
              throw new Error('Import Request not found');
            }
            await this.importRequestService.updateImportRequestStatus(
              importReceipt.inspectionReport.inspectionRequest.importRequestId,
              $Enums.ImportRequestStatus.IMPORTED,
              prismaInstance,
            );
          }
        } else {
          throw new Error('Material Receipt not found');
        }
        const result = await this.updateImportReceiptStatus(
          importReceiptId,
          $Enums.ImportReceiptStatus.IMPORTED,
        );
        await this.taskService.updateTaskStatusToDone({
          importReceiptId: importReceiptId,
        });
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
      include: {
        warehouseManager: {
          include: {
            account: true,
          },
        },
        task: {
          include: {
            todo: true,
          },
        },
        warehouseStaff: {
          include: {
            account: true,
          },
        },
        materialReceipt: {
          include: {
            materialPackage: {
              include: {
                materialVariant: {
                  include: {
                    material: {
                      include: {
                        materialUom: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        productReceipt: {
          include: {
            productSize: {
              include: {
                productVariant: {
                  include: {
                    product: {
                      include: {
                        productUom: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        inspectionReport: {
          include: {
            inspectionRequest: {
              include: {
                inspectionDepartment: {
                  include: {
                    account: true,
                  },
                },
                productionDeparment: {
                  include: {
                    account: true,
                  },
                },
                purchasingStaff: {
                  include: {
                    account: true,
                  },
                },
                importRequest: {
                  include: {
                    poDelivery: {
                      include: {
                        purchaseOrder: {
                          include: {
                            supplier: true,
                          },
                        },
                      },
                    },
                    warehouseStaff: {
                      include: {
                        account: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async findAll() {
    const result = await this.prismaService.importReceipt.findMany({
      include: importReceiptInclude,
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

  async search(
    findOptions: GeneratedFindOptions<Prisma.ImportReceiptWhereInput>,
  ) {
    const offset = findOptions?.skip || Constant.DEFAULT_OFFSET;
    const limit = findOptions?.take || Constant.DEFAULT_LIMIT;
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.importReceipt.findMany({
        skip: offset,
        take: limit,
        where: findOptions?.where,
        include: importReceiptInclude,
      }),
      this.prismaService.importReceipt.count({ where: findOptions?.where }),
    ]);
    const dataResponse: DataResponse = {
      data,
      pageMeta: getPageMeta(total, offset, limit),
    };
    return apiSuccess(
      HttpStatus.OK,
      dataResponse,
      'Get import receipts successfully',
    );
  }

  async getByUserToken(
    authenUser: AuthenUser,
    findOptions: GeneratedFindOptions<Prisma.ImportReceiptWhereInput>,
  ) {
    switch (authenUser.role) {
      case RoleCode.WAREHOUSE_MANAGER:
        findOptions.where = {
          warehouseManagerId: authenUser.warehouseManagerId,
        };
        return this.search(findOptions);
      case RoleCode.WAREHOUSE_STAFF:
        findOptions.where = {
          warehouseStaffId: authenUser.warehouseStaffId,
        };
        return this.search(findOptions);
      default:
        throw new ForbiddenException('This role is not allowed');
    }
  }
}
