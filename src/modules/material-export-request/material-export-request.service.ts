import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateMaterialExportRequestDto } from './dto/create-material-export-request.dto';
import { UpdateMaterialExportRequestDto } from './dto/update-material-export-request.dto';

@Injectable()
export class MaterialExportRequestService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createMaterialExportRequestDto: CreateMaterialExportRequestDto) {
    const materialExportRequestInput: Prisma.MaterialExportRequestUncheckedCreateInput =
      {
        productionBatchId: createMaterialExportRequestDto.productionBatchId,
        productionDepartmentId:
          createMaterialExportRequestDto.productionDepartmentId,
        description: createMaterialExportRequestDto.description,
        status: createMaterialExportRequestDto.status,
      };
  }

  async findAll() {
    return await this.prismaService.materialExportRequest.findMany();
  }

  async findUnique(id: string) {
    return await this.prismaService.materialExportRequest.findUnique({
      where: {
        id: id,
      },
    });
  }

  async update(
    id: string,
    updateMaterialExportRequestDto: UpdateMaterialExportRequestDto,
  ) {
    return `This action updates a #${id} materialExportRequest`;
  }

  remove(id: string) {
    return this.prismaService.materialExportRequest.delete({
      where: {
        id: id,
      },
    });
  }
}
