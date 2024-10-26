import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, PurchaseOrderStatus } from '@prisma/client';
import { isUUID } from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';
import { Constant } from 'src/common/constant/constant';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { ApiResponse } from 'src/common/dto/response.dto';
import { getPageMeta } from 'src/common/utils/utils';
import { ExcelService } from '../excel/excel.service';
import { PoDeliveryDto } from '../po-delivery/dto/po-delivery.dto';
import { PoDeliveryService } from '../po-delivery/po-delivery.service';
import { CancelledPurchaseOrderDto } from './dto/cancelled-purchase-order.dto';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { PurchaseOrderDto } from './dto/purchase-order.dto';
import { UpdatePurchaseOrderStatusDto } from './dto/update-purchase-order-status.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';

@Injectable()
export class PurchaseOrderService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly excelService: ExcelService,
    private readonly poDeliveryService: PoDeliveryService,
  ) {}

  queryInclude: Prisma.PurchaseOrderInclude = {
    supplier: true,
    poDelivery: {
      include: {
        poDeliveryDetail: {
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
      },
    },
  };

  async cancelledPurchaseOrder(
    id: string,
    cancelPurchaseOrder: CancelledPurchaseOrderDto,
  ) {
    const purchaseOrder = await this.findById(id);
    if (!purchaseOrder) {
      return apiFailed(HttpStatus.NOT_FOUND, 'Purchase Order not found');
    }
    if (purchaseOrder.status !== PurchaseOrderStatus.IN_PROGRESS) {
      return apiFailed(
        HttpStatus.BAD_REQUEST,
        'Purchase Order status is finished or cancelled, you cannot update the status',
      );
    }

    //Check if there are any importing PoDelivery
    const poDeliveries =
      await this.poDeliveryService.IsImportingOrFinishedPoDeliveryExist(id);

    if (poDeliveries) {
      return apiFailed(
        HttpStatus.BAD_REQUEST,
        'There are Po Deliveries that are importing or finished, you cannot cancel the Purchase Order',
      );
    }

    const result = await this.prismaService.$transaction(async (prisma) => {
      await this.poDeliveryService.updatePoDeliveryMaterialStatusByPoId(
        prisma,
        id,
        PurchaseOrderStatus.CANCELLED,
      );

      const result = await prisma.purchaseOrder.update({
        where: { id },
        data: {
          status: PurchaseOrderStatus.CANCELLED,
          cancelledReason: cancelPurchaseOrder.cancelledReason,
          cancelledAt: new Date(),
        },
      });
      return result;
    });

    if (result) {
      return apiSuccess(HttpStatus.OK, result, 'Purchase Order cancelled');
    }
    return apiFailed(HttpStatus.BAD_REQUEST, 'Failed to cancel Purchase Order');
  }

  async getPurchaseOrderStatistics() {
    const [total, inProgress, finished, cancelled] =
      await this.prismaService.$transaction([
        this.prismaService.purchaseOrder.count(),
        this.prismaService.purchaseOrder.count({
          where: { status: PurchaseOrderStatus.IN_PROGRESS },
        }),
        this.prismaService.purchaseOrder.count({
          where: { status: PurchaseOrderStatus.FINISHED },
        }),
        this.prismaService.purchaseOrder.count({
          where: { status: PurchaseOrderStatus.CANCELLED },
        }),
      ]);

    return apiSuccess(
      HttpStatus.OK,
      {
        total,
        inProgress,
        finished,
        cancelled,
      },
      'Purchase Order statistics',
    );
  }

  async getPurchaseOrderStatus() {
    return apiSuccess(
      HttpStatus.OK,
      Object.values(PurchaseOrderStatus),
      'List of Purchase Order Status',
    );
  }

  async deletePurchaseOrder(id: string) {
    try {
      await this.prismaService.purchaseOrder.delete({
        where: { id },
      });
    } catch (e) {
      console.log(e);
    }
    return apiSuccess(
      HttpStatus.OK,
      null,
      'Purchase Order deleted successfully',
    );
  }

  async getPurchaseOrders(
    filterOption?: GeneratedFindOptions<Prisma.PurchaseOrderWhereInput>,
  ) {
    const { skip, take, ...rest } = filterOption;
    const page = filterOption?.skip || Constant.DEFAULT_OFFSET;
    const limit = filterOption?.take || Constant.DEFAULT_LIMIT;
    const [result, total] = await this.prismaService.$transaction([
      this.prismaService.purchaseOrder.findMany({
        skip: page,
        take: limit,
        where: {
          ...rest?.where,
        },
        orderBy: filterOption?.orderBy,
        include: this.queryInclude,
      }),
      this.prismaService.purchaseOrder.count({
        where: filterOption?.where ? filterOption.where : undefined,
      }),
    ]);
    return apiSuccess(
      HttpStatus.OK,
      {
        data: result,
        pageMeta: getPageMeta(total, page, limit),
      },
      'List of Purchase Order',
    );
  }

  async createPurchaseOrder(purchaseOrderDto: PurchaseOrderDto) {
    return this.prismaService.purchaseOrder.create({
      data: purchaseOrderDto,
    });
  }
  async findByIdWithResponse(id: string) {
    const purchaseOrder = await this.findById(id);
    if (!purchaseOrder) {
      return apiFailed(HttpStatus.NOT_FOUND, 'Purchase Order not found');
    }
    // Return success response with data
    return apiSuccess(
      HttpStatus.OK,
      purchaseOrder,
      'Purchase Order retrieved successfully',
    );
  }

  async findById(id: string) {
    if (!isUUID(id)) {
      return null;
    }
    return this.prismaService.purchaseOrder.findUnique({
      where: { id },
      include: this.queryInclude,
    });
  }

  async createPurchaseOrderWithExcelFile(
    file: Express.Multer.File,
    purchasingStaffId: string,
  ) {
    const excelData = await this.excelService.readExcel(file);
    let purchaseOrder = null;
    if (excelData instanceof ApiResponse) {
      return excelData;
    } else {
      let subTotalAmount = 0;
      excelData.poDelivery.forEach((poDelivery) => {
        poDelivery.poDeliveryDetail.forEach((material) => {
          subTotalAmount += material.totalAmount;
        });
      });
      const PoNumber = await this.generateNextPoNumber();
      const createPurchaseOrderData =
        excelData as Partial<CreatePurchaseOrderDto>;
      const createPurchaseOrder: Prisma.PurchaseOrderCreateInput = {
        subTotalAmount: subTotalAmount,
        taxAmount: createPurchaseOrderData.taxAmount,
        expectedFinishDate: createPurchaseOrderData.expectedFinishDate,
        orderDate: createPurchaseOrderData.orderDate,
        status: PurchaseOrderStatus.IN_PROGRESS,
        supplier: {
          connect: { id: createPurchaseOrderData.Supplier.id },
        },
        currency: 'VND',
        purchasingStaff: {
          connect: { id: purchasingStaffId },
        },
        finishDate: undefined,
        shippingAmount: createPurchaseOrderData.shippingAmount,
        otherAmount: createPurchaseOrderData.otherAmount,
        poNumber: PoNumber,
      };

      purchaseOrder = await this.prismaService.$transaction(async (prisma) => {
        const purchaseOrder = await prisma.purchaseOrder.create({
          data: createPurchaseOrder,
        });
        for (let i = 0; i < excelData.poDelivery.length; i++) {
          const poDelivery: Partial<PoDeliveryDto> = excelData.poDelivery[i];
          let codeNumber =
            await this.poDeliveryService.generateManyNextPoDeliveryCodes(i + 1);
          const poDeliveryCreateInput: Prisma.PoDeliveryCreateInput = {
            isExtra: poDelivery.isExtra,
            purchaseOrder: { connect: { id: purchaseOrder.id } },
            expectedDeliverDate: poDelivery.expectedDeliverDate,
            code: codeNumber,
          };
          const poDeliveryResult = await prisma.poDelivery.create({
            data: poDeliveryCreateInput,
          });
          const poDeliveryDetails = poDelivery.poDeliveryDetail.map(
            (material) => {
              return {
                materialPackageId: material.materialVariantId,
                quantityByPack: material.quantityByPack,
                expiredDate: material.expiredDate,
                totalAmount: material.totalAmount,
                poDeliveryId: poDeliveryResult.id,
              };
            },
          );
          await prisma.poDeliveryDetail.createMany({
            data: poDeliveryDetails,
          });
        }
        return purchaseOrder;
      });
    }
    const result = await this.findById(purchaseOrder?.id);
    if (result) {
      return apiSuccess(
        HttpStatus.CREATED,
        result,
        'Purchase Order created successfully',
      );
    }
    return apiSuccess(
      HttpStatus.BAD_REQUEST,
      null,
      'Failed to create Purchase Order',
    );
  }

  async updatePurchaseOrder(
    id: string,
    updatedPurchaseOrderDto: UpdatePurchaseOrderDto,
  ) {
    return this.prismaService.purchaseOrder.update({
      where: { id },
      data: updatedPurchaseOrderDto,
    });
  }

  async updatePurchaseOrderStatus(
    id: string,
    updatedPurchaseOrderStatusDto: UpdatePurchaseOrderStatusDto,
  ) {
    let result = null;

    const purchaseOrder = await this.findById(id);

    if (!purchaseOrder) {
      return apiFailed(HttpStatus.NOT_FOUND, 'Purchase Order not found');
    }

    if (purchaseOrder.status !== PurchaseOrderStatus.IN_PROGRESS) {
      return apiFailed(
        HttpStatus.BAD_REQUEST,
        'Purchase Order status is finished or cancelled, you cannot update the status',
      );
    }

    if (
      updatedPurchaseOrderStatusDto.status === PurchaseOrderStatus.CANCELLED
    ) {
      result = await this.prismaService.$transaction(async (prisma) => {
        await this.poDeliveryService.updatePoDeliveryMaterialStatusByPoId(
          prisma,
          id,
          PurchaseOrderStatus.CANCELLED,
        );

        await prisma.purchaseOrder.update({
          where: { id },
          data: {
            status: PurchaseOrderStatus.CANCELLED,
          },
        });
      });
      return apiSuccess(HttpStatus.OK, null, 'Purchase Order cancelled');
    }

    if (updatedPurchaseOrderStatusDto.status === PurchaseOrderStatus.FINISHED) {
      result = await this.prismaService.$transaction(async (prisma) => {
        await this.poDeliveryService.updatePoDeliveryMaterialStatusByPoId(
          prisma,
          id,
          PurchaseOrderStatus.FINISHED,
        );

        await prisma.purchaseOrder.update({
          where: { id },
          data: {
            status: PurchaseOrderStatus.FINISHED,
          },
        });
      });
      return apiSuccess(HttpStatus.OK, null, 'Purchase Order finished');
    }

    if (result) {
      return apiSuccess(
        HttpStatus.OK,
        await this.findById(id),
        'Purchase Order updated',
      );
    }

    return apiFailed(HttpStatus.BAD_REQUEST, 'Invalid status');
  }

  async generateNextPoNumber() {
    const lastPo: any = await this.prismaService.$queryRaw<
      { poNumber: string }[]
    >`SELECT "PO_number" FROM "purchase_order" ORDER BY CAST(SUBSTRING("PO_number", 4) AS INT) DESC LIMIT 1`;

    const poNumber = lastPo[0]?.PO_number;
    console.log(poNumber);
    let nextCodeNumber = 1;
    if (poNumber) {
      const currentCodeNumber = parseInt(poNumber.replace(/^PO-?/, ''), 10);
      nextCodeNumber = currentCodeNumber + 1;
    }

    const nextCode = `${Constant.PO_CODE_PREFIX}-${nextCodeNumber.toString().padStart(6, '0')}`;
    return nextCode;
  }

  //Get warning before changing status, this should besed on all Po Deliveries status
  // async getStatusWarning(
  //   id: string,
  //   updatedPurchaseOrderStatusDto: UpdatePurchaseOrderStatusDto,
  // ) {
  //   const purchaseOrder = await this.findById(id);
  //   if (!purchaseOrder) {
  //     return apiFailed(HttpStatus.NOT_FOUND, 'Purchase Order not found');
  //   }

  //   if (purchaseOrder.status !== PurchaseOrderStatus.IN_PROGRESS) {
  //     return apiFailed(
  //       HttpStatus.BAD_REQUEST,
  //       'Purchase Order status is finished or cancelled, you cannot update the status',
  //     );
  //   }

  //   if (
  //     updatedPurchaseOrderStatusDto.status === PurchaseOrderStatus.CANCELLED
  //   ) {
  //     return apiSuccess(HttpStatus.OK, null, 'Purchase Order cancelled');
  //   }

  //   if (updatedPurchaseOrderStatusDto.status === PurchaseOrderStatus.FINISHED) {
  //     return apiSuccess(HttpStatus.OK, null, 'Purchase Order finished');
  //   }

  //   return apiFailed(HttpStatus.BAD_REQUEST, 'Invalid status');
  // }
}
