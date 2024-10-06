import { HttpStatus, Injectable } from '@nestjs/common';
import { PoDeliveryStatus, Prisma } from '@prisma/client';
import { isUUID } from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';
import { apiSuccess } from 'src/common/dto/api-response';
import { UpdatePoDeliveryDto } from './dto/update-po-delivery.dto';

@Injectable()
export class PoDeliveryService {
  constructor(private readonly pirsmaService: PrismaService) {}

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

  async updatePoDeliveryMaterialStatus(id: string, status: PoDeliveryStatus) {
    const result = await this.pirsmaService.poDelivery.update({
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
        await this.pirsmaService.purchaseOrder.update({
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
}
