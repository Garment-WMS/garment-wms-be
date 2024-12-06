import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import { InjectQueue } from '@nestjs/bullmq';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  $Enums,
  ImportReceipt,
  ImportReceiptStatus,
  PoDeliveryStatus,
  Prisma,
  ProductionBatchStatus,
  RoleCode,
} from '@prisma/client';
import { Queue } from 'bullmq';
import { isUUID } from 'class-validator';
import {
  discussionInclude,
  importReceiptInclude,
  inspectionReportDetailDefectIncludeWithoutInspectionReportDetail,
  materialPackageInclude,
  materialVariantInclude,
  productSizeInclude,
} from 'prisma/prisma-include';
import { PrismaService } from 'prisma/prisma.service';
import { Constant } from 'src/common/constant/constant';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { DataResponse } from 'src/common/dto/data-response';
import { CustomHttpException } from 'src/common/filter/custom-http.exception';
import { getPageMeta } from 'src/common/utils/utils';
import { AuthenUser } from '../auth/dto/authen-user.dto';
import { ChatService } from '../chat/chat.service';
import { CreateChatDto } from '../chat/dto/create-chat.dto';
import { DiscussionService } from '../discussion/discussion.service';
import { ImportRequestService } from '../import-request/import-request.service';
import { InventoryStockService } from '../inventory-stock/inventory-stock.service';
import { MaterialReceiptService } from '../material-receipt/material-receipt.service';
import { PoDeliveryMaterialService } from '../po-delivery-material/po-delivery-material.service';
import { PoDeliveryService } from '../po-delivery/po-delivery.service';
import { ProductReceiptService } from '../product-receipt/product-receipt.service';
import { ProductionBatchService } from '../production-batch/production-batch.service';
import { TaskService } from '../task/task.service';
import { CreateImportReceiptDto } from './dto/create-import-receipt.dto';
import { UpdateImportReceiptDto } from './dto/update-import-receipt.dto';

@Injectable()
export class ImportReceiptService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly materialReceiptService: MaterialReceiptService,
    private readonly productReceiptService: ProductReceiptService,
    // private readonly inspectionReportService: InspectionReportService,
    private readonly discussionService: DiscussionService,
    private readonly poDeliveryService: PoDeliveryService,
    private readonly inventoryStockService: InventoryStockService,
    private readonly importRequestService: ImportRequestService,
    private readonly poDeliveryDetailsService: PoDeliveryMaterialService,
    private readonly productionBatchService: ProductionBatchService,
    private readonly taskService: TaskService,
    private readonly chatService: ChatService,
    @InjectQueue('import-receipt') private importReceiptQueue: Queue,
  ) {}

  findByQuery(query: any) {
    return this.prismaService.importReceipt.findMany({
      where: query,
      include: importReceiptInclude,
    });
  }

  // async updateAwaitStatusToImportingStatus() {
  //   await this.prismaService.importReceipt.updateMany({
  //     where: {
  //       status: ImportRequestStatus.AWAIT_TO_IMPORT,
  //     },
  //     data: {
  //       status: ImportRequestStatus.IMPORTING,
  //     },
  //   });
  // }

  async getLatest(from: any, to: any) {
    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;

    const importReceipt = await this.prismaService.importReceipt.findMany({
      where: {
        createdAt: {
          ...(from ? { gte: fromDate } : {}),
          ...(to ? { lte: toDate } : {}),
        },
      },
      include: importReceiptInclude,
      orderBy: {
        createdAt: 'desc',
      },
    });
    return apiSuccess(
      HttpStatus.OK,
      importReceipt,
      'Get import receipts successfully',
    );
  }

  async findUniqueInspectedByRequestId(importRequestId: string) {
    Logger.debug('importRequestId: ' + importRequestId);
    const inspectionRequest =
      await this.prismaService.inspectionRequest.findFirst({
        where: {
          importRequestId: importRequestId,
          status: $Enums.InspectionRequestStatus.INSPECTED,
        },
        include: {
          importRequest: true,
        },
      });

    if (!inspectionRequest) {
      throw new ConflictException(
        'Inspection request not found for import request ' +
          inspectionRequest.code,
      );
    }

    const inspectionReport =
      await this.prismaService.inspectionReport.findFirst({
        where: {
          inspectionRequestId: inspectionRequest.id,
        },
        include: {
          inspectionRequest: {
            include: {
              importRequest: true,
              inspectionDepartment: true,
              purchasingStaff: true,
            },
          },
          inspectionReportDetail: true,
        },
      });

    if (!inspectionReport) {
      throw new NotFoundException(
        'Inspection report not found for inspection request' +
          inspectionRequest.code,
      );
    }

    return inspectionReport;
  }

  async createProductReceipt(
    createImportReceiptDto: CreateImportReceiptDto,
    managerId: string,
  ) {
    const importRequest = await this.validateImportRequest(
      createImportReceiptDto.importRequestId,
    );
    const inspectionReport = await this.findUniqueInspectedByRequestId(
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
      status: $Enums.ImportReceiptStatus.AWAIT_TO_IMPORT,
      type: 'PRODUCT',
      note: createImportReceiptDto.note,
      startedAt: createImportReceiptDto.startAt,
      finishedAt: createImportReceiptDto.finishAt,
    };

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
            importReceipt.status,
            prismaInstance,
          );
        }
        return importReceipt;
      },
    );
    if (result) {
      try {
        const chat: CreateChatDto = {
          discussionId: importRequest?.discussion.id,
          message: Constant.IMPORT_RECEIPT_INSPECTED_TO_AWAIT_TO_IMPORT,
        };
        await this.chatService.createBySystemWithoutResponse(chat);
        await this.updateTaskByImportReceipt(result);
        await this.discussionService.updateImportReceiptDiscussion(
          result.id,
          createImportReceiptDto.importRequestId,
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
    //Check is there any inventory report plan

    const importRequest = await this.validateImportRequest(
      createImportReceiptDto.importRequestId,
    );
    const inspectionReport = await this.findUniqueInspectedByRequestId(
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
      status: $Enums.ImportReceiptStatus.AWAIT_TO_IMPORT,
      type: 'MATERIAL',
      note: createImportReceiptDto.note,
      startedAt: createImportReceiptDto.startAt,
      finishedAt: createImportReceiptDto.finishAt,
    };

    console.log('importReceiptInput', importReceiptInput);
    let poDeliveryExtra;
    const poDeliveryExtraEl = [];
    const result = await this.prismaService.$transaction(
      async (prismaInstance: PrismaService) => {
        let importReceipt = await prismaInstance.importReceipt.create({
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
          //TODO: Validate this method when no there is no approved material
          if (result.length === 0) {
            await prismaInstance.importReceipt.delete({
              where: {
                id: importReceipt.id,
              },
            });
            importReceipt = null;
            await this.importRequestService.updateImportRequestStatus(
              inspectionReport.inspectionRequest.importRequestId,
              $Enums.ImportRequestStatus.REJECTED,
              prismaInstance,
            );
          } else {
            await this.importRequestService.updateImportRequestStatus(
              inspectionReport.inspectionRequest.importRequestId,
              importReceipt.status,
              prismaInstance,
            );
          }

          // Compare number of imported materials with number of approved material
          for (
            let i = 0;
            i < inspectionReport.inspectionReportDetail.length;
            i++
          ) {
            await this.prismaService.poDeliveryDetail.updateMany({
              where: {
                AND: [
                  {
                    poDeliveryId: importRequest.poDeliveryId,
                  },
                  {
                    materialPackageId:
                      inspectionReport.inspectionReportDetail[i]
                        .materialPackageId,
                  },
                ],
              },
              data: {
                actualImportQuantity:
                  inspectionReport.inspectionReportDetail[i]
                    .approvedQuantityByPack,
              },
            });

            //Create the extra PO delivery for the rejected material
            //TODO: Can use job queue to handle this to avoid bottleneck issues
            let poDelivery: any = importRequest.poDelivery;
            //Has to cast to any because issue with includeQuery ( Typescript error not mine, if include raw still work )
            let poDeliveryDetail = poDelivery.poDeliveryDetail as any;
            let expectedImportQuantity = poDeliveryDetail.find(
              (detail) =>
                detail.materialPackageId ===
                inspectionReport.inspectionReportDetail[i].materialPackageId,
            ).quantityByPack;
            if (
              inspectionReport.inspectionReportDetail[i]
                .approvedQuantityByPack !== expectedImportQuantity
            ) {
              poDeliveryExtra =
                await this.poDeliveryService.findExtraPoDelivery(
                  importRequest.poDelivery.purchaseOrderId,
                );
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
                    connect: {
                      id: inspectionReport.inspectionReportDetail[i]
                        .materialPackageId,
                    },
                  },
                  quantityByPack:
                    expectedImportQuantity -
                    inspectionReport.inspectionReportDetail[i]
                      .approvedQuantityByPack,
                  totalAmount: 0,
                },
                poDeliveryExtra.id,
                inspectionReport.inspectionReportDetail[i].materialPackageId,
                prismaInstance,
              );
            }
          }

          // const updatePromises = inspectionReport.inspectionReportDetail.map(
          //   async (detail) => {
          //     // Perform the updateMany operation
          //     await this.prismaService.poDeliveryDetail.updateMany({
          //       where: {
          //         AND: [
          //           { poDeliveryId: importRequest.poDeliveryId },
          //           { materialPackageId: detail.materialPackageId },
          //         ],
          //       },
          //       data: {
          //         actualImportQuantity: detail.approvedQuantityByPack,
          //       },
          //     });

          //     // Create the extra PO delivery for rejected material if necessary
          //     let poDelivery: any = importRequest.poDelivery;
          //     let poDeliveryDetail = poDelivery.poDeliveryDetail as any;
          //     let expectedImportQuantity = poDeliveryDetail.find(
          //       (d) => d.materialPackageId === detail.materialPackageId,
          //     ).quantityByPack;

          //     if (detail.approvedQuantityByPack !== expectedImportQuantity) {
          //       poDeliveryExtraEl.push(
          //         {
          //           poDelivery: {
          //             connect: { id: poDeliveryExtra.id },
          //           },
          //           materialPackage: {
          //             connect: {
          //               id: detail.materialPackageId,
          //             },
          //           },
          //           quantityByPack:
          //             expectedImportQuantity - detail.approvedQuantityByPack,
          //           totalAmount: 0,
          //         },
          //         // detail.materialPackageId,
          //       );
          //       // Create PoDeliveryMaterial
          //       // await this.poDeliveryDetailsService.createPoDeliveryMaterial(
          //       //   {
          //       //     poDelivery: {
          //       //       connect: { id: poDeliveryExtra.id },
          //       //     },
          //       //     materialPackage: {
          //       //       connect: {
          //       //         id: detail.materialPackageId,
          //       //       },
          //       //     },
          //       //     quantityByPack:
          //       //       expectedImportQuantity - detail.approvedQuantityByPack,
          //       //     totalAmount: 0,
          //       //   },
          //       //   poDeliveryExtra.id,
          //       //   detail.materialPackageId,
          //       //   prismaInstance,
          //       // );
          //     }
          //   },
          // );
          // // Wait for all the operations to complete concurrently
          // await Promise.all(updatePromises);
          //Update import request status to Approved
        }
        return importReceipt;
      },
      {
        timeout: 100000,
      },
    );
    
    console.log('result', result);
    if (!result) {
      const chat: CreateChatDto = {
        discussionId: importRequest?.discussion.id,
        message: Constant.IMPORT_REQUEST_INSPECTED_TO_CANCELLED,
      };
      await this.chatService.createBySystemWithoutResponse(chat);
    }

    // if(poDeliveryExtraEl.length > 0) {
    //   poDeliveryExtra = await this.poDeliveryService.findExtraPoDelivery(
    //     importRequest.poDelivery.purchaseOrderId,
    //   );
    //   if (!poDeliveryExtra) {
    //     poDeliveryExtra = await this.poDeliveryService.createPoDelivery({
    //       purchaseOrderId: importRequest.poDelivery.purchaseOrderId,
    //       isExtra: true,
    //       status: PoDeliveryStatus.PENDING,
    //     });
    //   }
    //   await this.poDeliveryDetailsService.createPoDeliveryMaterial(poDeliveryExtraEl, poDeliveryExtra.id);
    // }
    const chat: CreateChatDto = {
      discussionId: importRequest?.discussion.id,
      message: Constant.IMPORT_RECEIPT_INSPECTED_TO_AWAIT_TO_IMPORT,
    };
    await this.chatService.createBySystemWithoutResponse(chat);

    if (result) {
      await this.updateTaskByImportReceipt(result);
      await this.discussionService.updateImportReceiptDiscussion(
        result.id,
        createImportReceiptDto.importRequestId,
      );
    }
    // } catch (e) {
    //   Logger.error(e);
    //   throw new ConflictException('Can not create Task automatically');
    // }
    return apiSuccess(
      HttpStatus.CREATED,
      result,
      'Create import receipt successfully',
    );
  }
  async isAnyWaitOrInProgressReportPlan() {
    const result = await this.prismaService.inventoryReportPlan.findMany({
      where: {
        status: {
          in: [
            $Enums.InventoryReportPlanStatus.AWAIT,
            $Enums.InventoryReportPlanStatus.IN_PROGRESS,
          ],
        },
      },
    });
    return result.length > 0;
  }

  async getImportRequestByImportReceiptId(importReceiptId: string) {
    const importRequest = await this.prismaService.importRequest.findFirst({
      where: {
        inspectionRequest: {
          some: {
            inspectionReport: {
              importReceipt: {
                id: importReceiptId,
              },
            },
          },
        },
      },
    });
    return importRequest;
  }

  async updateTaskByImportReceipt(importReceipt: ImportReceipt) {
    // const createTaskDto: CreateTaskDto = {
    //   taskType: 'IMPORT',
    //   importReceiptId: importReceipt.id,
    //   warehouseStaffId: warehouseId,
    //   status: $Enums.TaskStatus.OPEN,
    //   expectedStartedAt: importReceipt.expectedStartedAt,
    //   expectedFinishedAt: importReceipt.expectFinishedAt,
    // };
    const importRequest = await this.getImportRequestByImportReceiptId(
      importReceipt.id,
    );

    const task = await this.prismaService.task.findFirst({
      where: {
        importRequestId: importRequest.id,
      },
      select: { id: true },
    });

    if (!task) {
      throw new ConflictException(
        `Cant update import receipt Task to done since import request of import receipt ${importReceipt.id} not found`,
      );
    }

    const result = await this.prismaService.task.update({
      where: { id: task.id },
      data: {
        exportReceiptId: importReceipt.id,
      },
    });

    return result;
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

    if (importRequest.status === $Enums.ImportRequestStatus.CANCELLED) {
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

  async updateImportReceiptStatusToImportedOrRejected(
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

  async finishImportReceipt(importReceiptId: string, user: AuthenUser) {
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
    const result = await this.prismaService.$transaction(
      async (prismaInstance: PrismaService) => {
        if (importReceipt?.materialReceipt.length > 0) {
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

            if (
              importReceipt.inspectionReport.inspectionRequest.importRequest
                .poDeliveryId
            ) {
              await this.poDeliveryService.updatePoDeliveryMaterialStatus(
                importReceipt.inspectionReport.inspectionRequest?.importRequest
                  ?.poDeliveryId,
                PoDeliveryStatus.FINISHED,
                prismaInstance,
              );
            }
          }
        } else if (importReceipt?.productReceipt.length > 0) {
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
          await this.productionBatchService.updateProductBatchStatus(
            importReceipt.inspectionReport.inspectionRequest.importRequest
              .productionBatchId,
            $Enums.ProductionBatchStatus.FINISHED,
            prismaInstance,
          );
        } else {
          throw new Error('Receipt not found');
        }

        const result = await this.updateImportReceiptStatusToImportedOrRejected(
          importReceiptId,
          $Enums.ImportReceiptStatus.IMPORTED,
        );
        await this.taskService.updateTaskStatusToDone({
          importReceiptId: importReceiptId,
        });
        return result;
      },
    );
    const chat: CreateChatDto = {
      discussionId: importReceipt.discussion.id,
      message: Constant.IMPORTING_TO_IMPORTED,
    };
    await this.chatService.create(chat, user);

    await this.importReceiptQueue.add('check-last-importing-receipt', {});

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

  async updateImportReceiptStatusToImporting(
    importReceiptId: string,
    user: AuthenUser,
  ) {
    const { inventoryReportPlan, collisionMaterialVariant } =
      await this.getInventoryReportPlanCollisionWithImportReceipt(
        importReceiptId,
      );
    if (inventoryReportPlan.length > 0) {
      throw new CustomHttpException(
        409,
        apiFailed(
          409,
          'There are inventory report plan is in progress please wait for it to finish',
          { inventoryReportPlan, collisionMaterialVariant },
        ),
      );
    }
    const importRequest = await this.prismaService.importReceipt.update({
      where: {
        id: importReceiptId,
      },
      data: {
        status: ImportReceiptStatus.IMPORTING,
        startedAt: new Date(),
      },
      include: {
        discussion: true,
      },
    });
    const task = await this.taskService.updateTaskStatusToInProgress({
      importReceiptId: importReceiptId,
    });

    const chat: CreateChatDto = {
      discussionId: importRequest?.discussion.id,
      message: Constant.AWAIT_TO_IMPORT_TO_IMPORTING,
    };
    await this.chatService.createWithoutResponse(chat, user);

    return { importRequest, task };
  }

  findUnique(id: string) {
    if (!isUUID(id)) {
      throw new Error('Invalid UUID');
    }

    return this.prismaService.importReceipt.findUnique({
      where: { id },
      include: {
        discussion: { include: discussionInclude },
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
            inspectionReportDetail: {
              include: {
                materialPackage: {
                  include: materialPackageInclude,
                },
                productSize: {
                  include: productSizeInclude,
                },
                inspectionReportDetailDefect: {
                  include:
                    inspectionReportDetailDefectIncludeWithoutInspectionReportDetail,
                },
              },
            },
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
  async test() {
    console.log('asd');
    await this.importReceiptQueue.add('check-last-importing-receipt', {});
    return apiSuccess(200, {}, 'Test');
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
        orderBy: findOptions?.orderBy,
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

  async getByImportRequestId(importRequestId: string) {
    const data = await this.prismaService.importReceipt.findMany({
      where: {
        inspectionReport: {
          inspectionRequest: {
            importRequestId: importRequestId,
          },
        },
      },
      include: importReceiptInclude,
    });

    return apiSuccess(
      HttpStatus.OK,
      data,
      'Get import receipt by import request id successfully',
    );
  }

  async checkIsLastImportingImportReceipt() {
    const importReceipt = await this.prismaService.importReceipt.findFirst({
      where: {
        status: ImportReceiptStatus.IMPORTING,
      },
    });
    return importReceipt ? false : true;
  }

  //NOT DRY
  // async getInventoryReportPlanNow() {
  //   const result = await this.prismaService.inventoryReportPlan.findMany({
  //     where: {
  //       status: {
  //         in: [
  //           $Enums.InventoryReportPlanStatus.AWAIT,
  //           $Enums.InventoryReportPlanStatus.IN_PROGRESS,
  //         ],
  //       },
  //     },
  //   });
  //   return result;
  // }
  async getInventoryReportPlanCollisionWithImportReceipt(
    importReceiptId: string,
  ) {
    const inventoryReportPlan =
      await this.prismaService.inventoryReportPlan.findMany({
        where: {
          status: {
            in: [
              $Enums.InventoryReportPlanStatus.AWAIT,
              $Enums.InventoryReportPlanStatus.IN_PROGRESS,
            ],
          },
          inventoryReportPlanDetail: {
            some: {
              materialVariant: {
                materialPackage: {
                  some: {
                    materialReceipt: {
                      some: {
                        importReceiptId: importReceiptId,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        include: {
          inventoryReportPlanDetail: {
            include: {
              materialVariant: {
                include: materialVariantInclude,
              },
            },
          },
        },
      });

    const collisionMaterialVariant = inventoryReportPlan.map(
      (inventoryReportPlan) => {
        return inventoryReportPlan.inventoryReportPlanDetail.map((detail) => {
          return detail.materialVariant;
        });
      },
    );
    return { inventoryReportPlan, collisionMaterialVariant };
  }
}
