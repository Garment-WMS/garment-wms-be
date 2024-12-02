import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { $Enums, PoDeliveryStatus, Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { isUUID, ValidationError } from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';
import { Constant } from 'src/common/constant/constant';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { CreateImportRequestDetailDto } from '../import-request/dto/import-request-detail/create-import-request-detail.dto';
import { PoDeliveryMaterialService } from '../po-delivery-material/po-delivery-material.service';
import { CancelPoDeliveryDto } from './dto/cancel-po-delivery.dto';
import { PoDeliveryDto } from './dto/po-delivery.dto';
import { UpdatePoDeliveryDto } from './dto/update-po-delivery.dto';

@Injectable()
export class PoDeliveryService {
  constructor(
    private readonly pirsmaService: PrismaService,
    private readonly poDeliveryMaterialService: PoDeliveryMaterialService,
  ) {}

  findExtraPoDelivery(purchaseOrderId: string) {
    return this.pirsmaService.poDelivery.findFirst({
      where: {
        purchaseOrderId,
        isExtra: true,
      },
      include: {
        poDeliveryDetail: true,
      },
    });
  }

  async cancelPoDelivery(
    id: string,
    cancelPoDeliveryDto: CancelPoDeliveryDto,
    purchasingStaffId: string,
  ) {
    const poDelivery = await this.findPoDeliveryId(id);
    if (poDelivery.status === 'IMPORTING') {
      return apiFailed(
        HttpStatus.BAD_REQUEST,
        'Cannot cancel po delivery while importing',
      );
    }
    if (poDelivery.status === 'FINISHED' || poDelivery.status === 'CANCELLED') {
      return apiFailed(
        HttpStatus.BAD_REQUEST,
        'Cannot cancel po delivery while it is finished or cancelled',
      );
    }
    const result = await this.pirsmaService.poDelivery.update({
      where: {
        id,
      },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancelledBy: purchasingStaffId,
        cancelledReason: cancelPoDeliveryDto.cancelReason || undefined,
      },
    });
    return apiSuccess(HttpStatus.OK, result, 'Cancel po delivery successfully');
  }

  async createPoDeliveryNotExtra(
    poDeliveryCreateInput: Prisma.PoDeliveryCreateInput,
    prismaInstance: PrismaService = this.pirsmaService,
  ) {
    return prismaInstance.poDelivery.create({
      data: poDeliveryCreateInput,
    });
  }

  getExpiredDate(
    poDeliveryId: string,
    materialPackageId: string,
    prismaInstance: PrismaClient<
      Prisma.PrismaClientOptions,
      never,
      DefaultArgs
    >,
  ) {
    return prismaInstance.poDeliveryDetail.findFirst({
      where: {
        poDeliveryId,
        materialPackageId,
      },
      select: {
        expiredDate: true,
      },
    });
  }

  async getPoDeliveryByPoId(Poid: string) {
    const result = await this.findPoDelivery({
      purchaseOrderId: Poid,
    });

    if (result) {
      return apiSuccess(HttpStatus.OK, result, 'Get po delivery successfully');
    }
    return apiSuccess(HttpStatus.NOT_FOUND, null, 'Po delivery not found');
  }

  async IsImportingOrFinishedPoDeliveryExist(PoId: string) {
    const poDeliveries = await this.pirsmaService.poDelivery.findMany({
      where: {
        purchaseOrderId: PoId,
        status: {
          in: [PoDeliveryStatus.IMPORTING, PoDeliveryStatus.FINISHED],
        },
      },
    });
    return poDeliveries.length > 0;
  }

  async checkIsPoDeliveryStatus(poDeliveryId: string) {
    const poDelivery = await this.findById(poDeliveryId);
    if (!poDelivery) {
      throw new BadRequestException('Po delivery not found');
    }

    // Check if the po delivery is already finished
    if (poDelivery.status === PoDeliveryStatus.FINISHED) {
      throw new BadRequestException('Po delivery already finished');
    }

    //Check if the po delivery is already cancelled
    if (poDelivery.status === PoDeliveryStatus.CANCELLED) {
      throw new BadRequestException('Po delivery already cancelled');
    }

    if (poDelivery.poDeliveryDetail.length === 0) {
      throw new BadRequestException('Po delivery detail is empty');
    }
    return poDelivery;
  }
  updateStatus(poDeliveryId: string, PoDeliveryStatus: PoDeliveryStatus) {
    return this.pirsmaService.poDelivery.update({
      where: {
        id: poDeliveryId,
      },
      data: {
        status: PoDeliveryStatus,
        deliverDate: new Date(),
      },
    });
  }

  includeQuery: Prisma.PoDeliveryInclude = {
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
    importRequest: {
      include: {
        inspectionRequest: {
          include: {
            inspectionReport: {
              include: {
                importReceipt: {
                  include: {
                    materialReceipt: true,
                  },
                },
              },
            },
          },
        },
        importRequestDetail: {
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

  async createPoDelivery(
    CreatePoDelivery: Partial<PoDeliveryDto>,
    prismaInstance: PrismaService = this.pirsmaService,
  ) {
    const result = await prismaInstance.poDelivery.findMany({
      where: {
        AND: [
          { purchaseOrderId: CreatePoDelivery.purchaseOrderId },
          { isExtra: true },
          { status: PoDeliveryStatus.PENDING },
        ],
      },
    });

    if (result.length > 0) {
      return result[0];
    }

    const poDeliveryInput: Prisma.PoDeliveryCreateInput = {
      code: undefined,
      isExtra: true,
      purchaseOrder: {
        connect: {
          id: CreatePoDelivery.purchaseOrderId,
        },
      },
    };

    return prismaInstance.poDelivery.create({
      data: poDeliveryInput,
    });
  }

  async createPoDeliveryExtra(CreatePoDelivery: Prisma.PoDeliveryCreateInput) {
    return this.pirsmaService.poDelivery.create({
      data: CreatePoDelivery,
    });
  }

  async getOnePoDelivery(id: string) {
    const result = await this.findPoDeliveryId(id);

    if (result) {
      return apiSuccess(HttpStatus.OK, result, 'Get po delivery successfully');
    }
    return apiSuccess(HttpStatus.NOT_FOUND, null, 'Po delivery not found');
  }

  async findPoDeliveryId(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid po delivery id');
    }
    return this.pirsmaService.poDelivery.findUnique({
      where: {
        id: id,
      },
      include: this.includeQuery,
    });
  }

  findPoDelivery(
    query: Prisma.PoDeliveryWhereInput,
    prismaInstance: PrismaService = this.pirsmaService,
  ) {
    return prismaInstance.poDelivery.findMany({
      where: { ...query },
      include: this.includeQuery,
    });
  }

  async findPoDeliveryByPoId(poId: string) {
    return this.pirsmaService.poDelivery.findFirst({
      where: {
        purchaseOrderId: poId,
      },
      include: this.includeQuery,
    });
  }

  async updatePoDelivery(id: string, updatePoDeliveryDto: UpdatePoDeliveryDto) {
    // const result = await this.updatePoDeliveryMaterialStatus(
    //   id,
    //   updatePoDeliveryDto.status,
    //   this.pirsmaService,
    // );

    // if (result) {
    //   return apiSuccess(
    //     HttpStatus.OK,
    //     result,
    //     'Update po delivery successfully',
    //   );
    // }
    return apiSuccess(HttpStatus.NOT_FOUND, null, 'Po delivery not found');
  }

  async updatePoDeliveryMaterialStatus(
    id: string,
    status: PoDeliveryStatus,
    prismaInstance: PrismaService = this.pirsmaService,
  ) {
    const result = await prismaInstance.poDelivery.update({
      where: { id },
      data: {
        status,
      },
    });
    if (result) {
      //Check if there is another po delivery with PENDING STATUS for the same purchase order
      const resultWithSameStatus = await this.findPoDelivery(
        {
          purchaseOrderId: result.purchaseOrderId,
          status: PoDeliveryStatus.PENDING,
        },
        prismaInstance,
      );

      //If there is no other po delivery with PENDING STATUS, update the purchase order status to FINISHED
      if (resultWithSameStatus.length === 0) {
        console.log('update po status', result);
        await prismaInstance.purchaseOrder.update({
          where: {
            id: result.purchaseOrderId,
            // status: $Enums.PurchaseOrderStatus.IN_PROGRESS,
          },
          data: {
            status: $Enums.PurchaseOrderStatus.FINISHED,
          },
        });
      }

      return apiSuccess(
        HttpStatus.OK,
        result,
        'Update po delivery status successfully',
      );
    }
    return apiSuccess(HttpStatus.NOT_FOUND, null, 'Po delivery not found');
  }

  async updatePoDeliveryMaterialStatusByPoId(
    prisma: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    > = this.pirsmaService,
    poId: string,
    status: PoDeliveryStatus,
  ) {
    const result = await prisma.poDelivery.updateMany({
      where: { purchaseOrderId: poId, status: PoDeliveryStatus.PENDING },
      data: {
        status,
      },
    });

    return !!result.count;
  }

  async findById(id: string) {
    if (!isUUID(id)) {
      return null;
    }
    const result = await this.pirsmaService.poDelivery.findUnique({
      where: { id },
      include: this.includeQuery,
    });
    return result;
  }

  async checkIsPoDeliveryValid(
    poDelivery: any,
    importRequestDetails: CreateImportRequestDetailDto[],
  ) {
    let error: ValidationError[] = [];
    importRequestDetails.forEach((importRequestDetail) => {
      const isExist = poDelivery.poDeliveryDetail.some((poDeliveryDetail) => {
        return (
          poDeliveryDetail.materialPackageId ===
          importRequestDetail.materialPackageId
        );
      });

      if (!isExist) {
        error.push({
          property: 'materialPackageId',
          children: [],
          target: importRequestDetail,
          constraints: {
            isExist: 'Material package not found in po delivery',
          },
          value: importRequestDetail.materialPackageId,
          contexts: {},
        });
      } else {
        const isValidQuantity = poDelivery.poDeliveryDetail.some(
          (poDeliveryDetail) => {
            return (
              poDeliveryDetail.materialPackageId ===
                importRequestDetail.materialPackageId &&
              poDeliveryDetail.quantityByPack >=
                importRequestDetail.quantityByPack
            );
          },
        );
        if (!isValidQuantity) {
          error.push({
            property: 'quantityByPack',
            children: [],
            target: importRequestDetail,
            constraints: {
              min: 'Quantity by pack must be less than or equal to po delivery',
            },
            value: importRequestDetail.quantityByPack,
            contexts: {},
          });
        }
      }
    });

    if (error.length > 0) {
      return error;
    }
    return null;
  }

  async generateNextPoDeliveryCode() {
    const lastPo_delivery: any = await this.pirsmaService.$queryRaw<
      { poNumber: string }[]
    >`SELECT "code" FROM "po_delivery" ORDER BY CAST(SUBSTRING("code", 4) AS INT) DESC LIMIT 1`;

    const poDeliveryCode = lastPo_delivery[0]?.code;
    let nextCodeNumber = 1;
    if (poDeliveryCode) {
      const currentCodeNumber = parseInt(
        poDeliveryCode.replace(/^POD-?/, ''),
        10,
      );
      nextCodeNumber = currentCodeNumber + 1;
    }

    const nextCode = `${Constant.POD_CODE_PREFIX}-${nextCodeNumber.toString().padStart(6, '0')}`;
    return nextCode;
  }

  async generateManyNextPoDeliveryCodes(index: number) {
    const lastPo_delivery: any = await this.pirsmaService.$queryRaw<
      { poNumber: string }[]
    >`SELECT "code" FROM "po_delivery" ORDER BY CAST(SUBSTRING("code", 5) AS INT) DESC LIMIT 1`;
    const poDeliveryCode = lastPo_delivery[0]?.code;
    let nextCodeNumber = 1 + index;
    if (poDeliveryCode) {
      const currentCodeNumber = extractNumberFromCode(poDeliveryCode);
      nextCodeNumber = currentCodeNumber + index;
    }

    const nextCode = `${Constant.POD_CODE_PREFIX}-${nextCodeNumber.toString().padStart(6, '0')}`;
    //Check is the next code is already exist
    console.log(nextCode);

    const isExist = await this.pirsmaService.poDelivery.findFirst({
      where: {
        code: nextCode,
      },
    });
    if (isExist) {
      console.log('nextCode', nextCode);
      return this.generateManyNextPoDeliveryCodes(index + 1);
    }

    return nextCode;
  }
}

export const extractNumberFromCode = (code: string): number => {
  const match = code.match(/-(\d+)$/);
  if (match) {
    return parseInt(match[1], 10);
  }
  throw new Error('Invalid code format');
};
