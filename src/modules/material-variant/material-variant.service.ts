import { HttpStatus, Injectable } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { CreateMaterialVariantDto } from './dto/create-material-variant.dto';
import { UpdateMaterialVariantDto } from './dto/update-material-variant.dto';

@Injectable()
export class MaterialVariantService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createMaterialVariantDto: CreateMaterialVariantDto) {
    const result = await this.prismaService.materialVariant.create({
      data: createMaterialVariantDto,
    });

    if (result) {
      return apiSuccess(
        HttpStatus.CREATED,
        result,
        'Material Variant created successfully',
      );
    }
    return apiFailed(
      HttpStatus.BAD_REQUEST,
      'Failed to create Material Variant',
    );
  }

  async findAll() {
    const result = await this.prismaService.materialVariant.findMany();
    return apiSuccess(HttpStatus.OK, result, 'List of Material Variant');
  }

  async findById(id: string) {
    if (!isUUID(id)) {
      return null;
    }
    const result = await this.prismaService.materialVariant.findUnique({
      where: { id },
    });
    return result;
  }

  async update(id: string, updateMaterialVariantDto: UpdateMaterialVariantDto) {
    const materialVariant = await this.findById(id);
    if (!materialVariant) {
      return apiFailed(HttpStatus.NOT_FOUND, 'Material Variant not found');
    }

    const result = await this.prismaService.materialVariant.update({
      where: { id },
      data: updateMaterialVariantDto,
    });

    if (result) {
      return apiSuccess(
        HttpStatus.OK,
        result,
        'Material Variant updated successfully',
      );
    }

    return apiFailed(
      HttpStatus.BAD_REQUEST,
      'Failed to update Material Variant',
    );
  }
}
