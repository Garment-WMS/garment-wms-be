import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateImportRequestDto } from './dto/import-request/create-import-request.dto';
import { UpdateImportRequestDto } from './dto/import-request/update-import-request.dto';

@Injectable()
export class ImportRequestService {
  constructor(private readonly prismaService: PrismaService) {}
  create(createImportRequestDto: CreateImportRequestDto) {
    const createImportRequestInput: Prisma.ImportRequestCreateInput = {
      ...createImportRequestDto,
      poDelivery: {
        connect: { id: createImportRequestDto.poDeliveryId },
      },
      importRequestDetail: {
        createMany: {
          data: createImportRequestDto.importRequestDetails,
        },
      },
    };
    return this.prismaService.importRequest.create({
      data: createImportRequestInput,
    });
  }

  findAll() {
    return this.prismaService.importRequest.findMany();
  }

  findOne(id: string) {
    return this.prismaService.importRequest.findUnique({
      where: { id },
    });
  }

  update(id: string, updateImportRequestDto: UpdateImportRequestDto) {
    const updateImportRequestInput: Prisma.ImportRequestUpdateInput = {
      ...updateImportRequestDto,
      importRequestDetail: {
        upsert: updateImportRequestDto.importRequestDetails.map((detail) => ({
          where: { id: detail.id },
          create: detail,
          update: detail,
        })),
      },
    };
    return this.prismaService.importRequest.update({
      where: { id },
      data: updateImportRequestInput,
    });
  }

  remove(id: string) {
    return this.prismaService.importRequest.delete({
      where: { id },
    });
  }
}
