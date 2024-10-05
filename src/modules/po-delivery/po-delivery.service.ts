import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
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
                      uom: true,
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

  updatePoDelivery(id: string, updatePoDeliveryDto: UpdatePoDeliveryDto) {
    throw new Error('Method not implemented.');
  }
}
