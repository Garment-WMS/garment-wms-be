import { HttpStatus, Injectable } from '@nestjs/common';
import { PoDeliveryStatus, Prisma } from '@prisma/client';
import { isUUID, ValidationError } from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { CreateImportRequestDetailDto } from '../import-request/dto/import-request-detail/create-import-request-detail.dto';
import { PoDeliveryMaterialService } from '../po-delivery-material/po-delivery-material.service';
import { UpdatePoDeliveryDto } from './dto/update-po-delivery.dto';

@Injectable()
export class PoDeliveryService {
  constructor(
    private readonly pirsmaService: PrismaService,
    private readonly poDeliveryMaterialService: PoDeliveryMaterialService,
  ) {}

  includeQuery: Prisma.PoDeliveryInclude = {
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
  };

  async createPoDelivery(CreatePoDelivery: Prisma.PoDeliveryCreateInput) {
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
    if (isUUID(id)) {
      return this.pirsmaService.poDelivery.findUnique({
        where: {
          id: id,
        },
        include: this.includeQuery,
      });
    }
    return null;
  }

  async findPoDelivery(query: Prisma.PoDeliveryWhereInput) {
    return this.pirsmaService.poDelivery.findFirst({
      where: { ...query },
    });
  }

  updatePoDelivery(id: string, updatePoDeliveryDto: UpdatePoDeliveryDto) {
    throw new Error('Method not implemented.');
  }

  async updatePoDeliveryMaterialStatus(
    prisma: any = this.pirsmaService,
    id: string,
    status: PoDeliveryStatus,
  ) {
    const result = await prisma.poDelivery.update({
      where: { id },
      data: {
        status,
      },
    });
    if (result) {
      //Check if there is another po delivery with PENDING STATUS for the same purchase order
      const resultWithSameStatus = await this.findPoDelivery({
        purchaseOrderId: result.purchaseOrderId,
        status: PoDeliveryStatus.PENDING,
      });

      //If there is no other po delivery with PENDING STATUS, update the purchase order status to FINISHED
      if (!resultWithSameStatus) {
        await prisma.purchaseOrder.update({
          where: { id: result.purchaseOrderId },
          data: {
            status: PoDeliveryStatus.FINISHED,
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
    poDeliveryId: string,
    importRequestDetails: CreateImportRequestDetailDto[],
  ) {
    const poDelivery = await this.findById(poDeliveryId);
    let error: ValidationError[] = [];


    // if (!poDelivery) {
    //   return apiFailed(HttpStatus.NOT_FOUND, 'Po delivery not found');
    // }

    //Check if the po delivery is already finished
    // if (poDelivery.status === PoDeliveryStatus.FINISHED) {
    //   return apiFailed(HttpStatus.BAD_REQUEST, 'Po delivery already finished');
    // }

    // //Check if the po delivery is already cancelled
    // if (poDelivery.status === PoDeliveryStatus.CANCELLED) {
    //   return apiFailed(HttpStatus.BAD_REQUEST, 'Po delivery already cancelled');
    // }

    // if (poDelivery.poDeliveryDetail.length === 0) {
    //   return apiFailed(HttpStatus.BAD_REQUEST, 'Po delivery detail is empty');
    // }

    importRequestDetails.forEach((importRequestDetail) => {
      const isExist = poDelivery.poDeliveryDetail.some((poDeliveryDetail) => {
        return (
          poDeliveryDetail.materialVariantId ===
          importRequestDetail.materialVariantId
        );
      });

      if (!isExist) {
        error.push({
          property: 'materialVariantId',
          children: [],
          target: importRequestDetail,
          constraints: {
            isExist: 'Material variant not found in po delivery',
          },
          value: importRequestDetail.materialVariantId,
          contexts: {},
        });
      } else {
        const isValidQuantity = poDelivery.poDeliveryDetail.some(
          (poDeliveryDetail) => {
            return (
              poDeliveryDetail.materialVariantId ===
                importRequestDetail.materialVariantId &&
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
              isExist: 'Quantity by pack is invalid',
            },
            value: importRequestDetail.quantityByPack,
            contexts: {},
          });
        }
      }
    });
    return error;
  }
}
