import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, PurchaseOrderStatus } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { apiSuccess } from 'src/common/dto/api-response';
import { ApiResponse } from 'src/common/dto/response.dto';
import { ExcelService } from '../excel/excel.service';
import { PoDeliveryDto } from '../po-delivery/dto/po-delivery.dto';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { PurchaseOrderDto } from './dto/purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';

@Injectable()
export class PurchaseOrderService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly excelService: ExcelService,
  ) {}

  async getPurchaseOrders(
    filterOption?: GeneratedFindOptions<Prisma.PurchaseOrderWhereInput>,
  ) {
    const page = filterOption?.skip
      ? parseInt(filterOption?.skip.toString())
      : 1;
    const limit = filterOption?.take
      ? parseInt(filterOption?.take.toString())
      : 10;

    const result = await this.prismaService.purchaseOrder.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: filterOption?.where,
      orderBy: filterOption?.orderBy,
      include: {
        poDelivery: {
          select: {
            id: true,
            expectedDeliverDate: true,
            isExtra: true,
            poDeliveryDetail: {
              select: {
                materialVariant: {
                  include: {
                    material: {
                      include: {
                        uom: true,
                        materialType: true,
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
    return apiSuccess(HttpStatus.OK, result, 'List of Purchase Order');
  }

  async createPurchaseOrder(purchaseOrderDto: PurchaseOrderDto) {
    return this.prismaService.purchaseOrder.create({
      data: purchaseOrderDto,
    });
  }

  async createPurchaseOrderWithExcelFile(file: Express.Multer.File) {
    const excelData = await this.excelService.readExcel(file);
    if (excelData instanceof ApiResponse) {
      return excelData;
    } else {
      const createPurchaseOrderData =
        excelData as Partial<CreatePurchaseOrderDto>;
      const createPurchaseOrder: Prisma.PurchaseOrderCreateInput = {
        poNumber: createPurchaseOrderData.PONumber,
        totalAmount: createPurchaseOrderData.totalAmount,
        taxAmount: createPurchaseOrderData.taxAmount,
        expectedFinishDate: createPurchaseOrderData.expectedFinishDate,
        orderDate: createPurchaseOrderData.orderDate,
        status: PurchaseOrderStatus.IN_PROGESS,
        supplier: {
          connect: { id: createPurchaseOrderData.Supplier.id },
        },
        currency: 'VND',
        finishDate: undefined,
      };

      await this.prismaService.$transaction(async (prisma) => {
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
          console.log(poDelivery);
          const poDeliveryDetails = poDelivery.poDeliveryDetail.map(
            (material) => {
              console.log(material);
              return {
                materialVariantId: material.materialVariantId,
                quantityByPackagingUnit: material.quantityByPack,
                totalAmount: material.totalAmount,
                poDeliveryId: poDeliveryResult.id,
              };
            },
          );
          console.log(poDeliveryDetails);
          await prisma.poDeliveryDetail.createMany({
            data: poDeliveryDetails,
          });
        }
      });
    }
    return excelData;
  }

  async updatePurchaseOrder(
    id: string,
    updatedPurchaseOrderDto: UpdatePurchaseOrderDto,
  ) {
    // return this.prismaService.purchaseOrder.update({
    //   where: { id },
    //   // data: updatedPurchaseOrderDto,
    // });
  }
}
