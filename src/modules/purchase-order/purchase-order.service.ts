import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, PurchaseOrderStatus } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { Constant } from 'src/common/constant/constant';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { ApiResponse } from 'src/common/dto/response.dto';
import { ExcelService } from '../excel/excel.service';
import { PoDeliveryDto } from '../po-delivery/dto/po-delivery.dto';
import { PoDeliveryService } from '../po-delivery/po-delivery.service';
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
            materialVariant: {
              include: {
                material: {
                  include: {
                    materialUom: true,
                    materialType: true,
                  },
                },
              },
            },
          },
        },
      },
    },
  };

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
    const page = filterOption?.skip
      ? parseInt(filterOption?.skip.toString())
      : 1;
    const limit = filterOption?.take
      ? parseInt(filterOption?.take.toString())
      : 10;

    const [result, total] = await this.prismaService.$transaction([
      this.prismaService.purchaseOrder.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: filterOption?.where,
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
        pageMeta: {
          totalItems: total,
          page: page,
          limit: limit,
          totalPages: Math.ceil(total / limit),
          hasNext: total > page * limit,
          hasPrevious: page > 1,
        },
      },
      'List of Purchase Order',
    );
  }

  async createPurchaseOrder(purchaseOrderDto: PurchaseOrderDto) {
    return this.prismaService.purchaseOrder.create({
      data: purchaseOrderDto,
    });
  }
  async findById(id: string) {
    const purchaseOrder = await this.prismaService.purchaseOrder.findUnique({
      where: { id },
      include: this.queryInclude,
    });
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

  async createPurchaseOrderWithExcelFile(file: Express.Multer.File) {
    const excelData = await this.excelService.readExcel(file);
    let purchaseOrder = null;
    if (excelData instanceof ApiResponse) {
      return excelData;
    } else {
      const PoNumber = await this.generateNextPoNumber();
      const createPurchaseOrderData =
        excelData as Partial<CreatePurchaseOrderDto>;
      const createPurchaseOrder: Prisma.PurchaseOrderCreateInput = {
        subTotalAmount: createPurchaseOrderData.subTotal,
        taxAmount: createPurchaseOrderData.taxAmount,
        expectedFinishDate: createPurchaseOrderData.expectedFinishDate,
        orderDate: createPurchaseOrderData.orderDate,
        status: PurchaseOrderStatus.IN_PROGRESS,
        supplier: {
          connect: { id: createPurchaseOrderData.Supplier.id },
        },
        currency: 'VND',
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
          const poDeliveryCreateInput: Prisma.PoDeliveryCreateInput = {
            isExtra: poDelivery.isExtra,
            purchaseOrder: { connect: { id: purchaseOrder.id } },
            expectedDeliverDate: poDelivery.expectedDeliverDate,
          };
          const poDeliveryResult = await prisma.poDelivery.create({
            data: poDeliveryCreateInput,
          });
          const poDeliveryDetails = poDelivery.poDeliveryDetail.map(
            (material) => {
              return {
                materialVariantId: material.materialVariantId,
                quantityByPack: material.quantityByPack,
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
    if (
      updatedPurchaseOrderStatusDto.status === PurchaseOrderStatus.CANCELLED
    ) {
      result = await this.prismaService.$transaction(async (prisma) => {
        await this.poDeliveryService.updatePoDeliveryMaterialStatus(
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

    //The finished status is updated based on the status all of the po delivery
    // if (updatedPurchaseOrderStatusDto.status === PurchaseOrderStatus.FINISHED) {
    //   result = await this.prismaService.$transaction(async (prisma) => {
    //     await this.poDeliveryService.updatePoDeliveryMaterialStatus(
    //       prisma,
    //       id,
    //       PurchaseOrderStatus.FINISHED,
    //     );

    //     await prisma.purchaseOrder.update({
    //       where: { id },
    //       data: {
    //         status: PurchaseOrderStatus.FINISHED,
    //       },
    //     });
    //   });
    //   return apiSuccess(HttpStatus.OK, null, 'Purchase Order finished');
    // }

    if (result) {
      return apiSuccess(HttpStatus.OK, null, 'Purchase Order updated');
    }

    return apiFailed(HttpStatus.BAD_REQUEST, 'Invalid status');
  }

  async generateNextPoNumber() {
    const lastPo: any = await this.prismaService.$queryRaw<
      { poNumber: string }[]
    >`SELECT "PO_number" FROM "purchase_order" ORDER BY CAST(SUBSTRING("PO_number", 4) AS INT) DESC LIMIT 1`;

    const poNumber = lastPo[0]?.PO_number;
    let nextCodeNumber = 1;
    if (poNumber) {
      const currentCodeNumber = parseInt(poNumber.replace(/^PO-?/, ''), 10);
      nextCodeNumber = currentCodeNumber + 1;
    }

    const nextCode = `${Constant.PO_CODE_PREFIX}-${nextCodeNumber.toString().padStart(6, '0')}`;
    return nextCode;
  }
}
