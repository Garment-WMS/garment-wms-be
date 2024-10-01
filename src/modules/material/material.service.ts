import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUUID } from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { CreateMaterialDto } from './dto/create-material.dto';

@Injectable()
export class MaterialService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createMaterialDto: CreateMaterialDto) {
    const { materialTypeId, packagingUnitId, uomId, ...rest } =
      createMaterialDto;

    const materialInput: Prisma.MaterialCreateInput = {
      ...rest,
      materialType: {
        connect: {
          id: materialTypeId,
        },
      },
      packagingUnit: {
        connect: {
          id: packagingUnitId,
        },
      },
      uom: {
        connect: {
          id: uomId,
        },
      },
    };

    const result = await this.prismaService.material.create({
      data: materialInput,
    });
    if (result) {
      return apiSuccess(
        HttpStatus.CREATED,
        result,
        'Material created successfully',
      );
    }

    return apiFailed(HttpStatus.BAD_REQUEST, 'Material not created');
  }

  async findAll() {
    const result = await this.prismaService.material.findMany();
    return apiSuccess(HttpStatus.OK, result, 'List of Material');
  }

  async findByIdWithResponse(id: string) {
    const result = await this.prismaService.material.findFirst({
      where: { id },
    });
    if (result) {
      return apiSuccess(HttpStatus.OK, result, 'Material found');
    }
    return apiFailed(HttpStatus.NOT_FOUND, 'Material not found');
  }

  async findById(id: string) {
    if (!isUUID(id)) {
      return null;
    }
    const result = await this.prismaService.material.findFirst({
      where: { id },
    });
    return result;
  }

  async findByMaterialCode(materialCode: string) {
    const result = await this.prismaService.material.findFirst({
      where: { code: materialCode },
    });
    if (result) {
      return apiSuccess(HttpStatus.OK, result, 'Material found');
    }
    return apiFailed(HttpStatus.NOT_FOUND, 'Material not found');
  }

  async findByMaterialType(materialType: string) {
    const result = await this.prismaService.material.findMany({
      where: { materialType: { id: materialType } },
    });
    if (result) {
      return apiSuccess(HttpStatus.OK, result, 'Material found');
    }
    return apiFailed(HttpStatus.NOT_FOUND, 'Material not found');
  }
}
