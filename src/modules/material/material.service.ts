import { HttpStatus, Injectable } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';
import { apiSuccess } from 'src/common/dto/api-response';
import { CreateMaterialTypeDto } from './dto/create-material-type.dto';
import { UpdateMaterialTypeDto } from './dto/update-material-type.dto';

@Injectable()
export class MaterialService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createMaterialTypeDto: CreateMaterialTypeDto) {
    const result = await this.prismaService.material.create({
      data: createMaterialTypeDto,
    });

    if (result) {
      return apiSuccess(
        HttpStatus.CREATED,
        result,
        'Material Type created successfully',
      );
    } else {
      return apiSuccess(
        HttpStatus.BAD_REQUEST,
        result,
        'Material Type not created',
      );
    }
  }

  async findById(id: string) {
    if (!isUUID(id)) {
      return null;
    }
    const result = await this.prismaService.material.findUnique({
      where: { id },
    });
    return result;
  }

  async findAll() {
    const result = await this.prismaService.material.findMany({
      include: {
        _count: {
          select: { materialVariant: true },
        },
      },
    });
    // const { _count, ...rest } = result as any;
    const formattedResult = result.map(({ _count, ...material }) => ({
      ...material,
      numberOfMaterialVariants: _count.materialVariant,
    }));
    return apiSuccess(HttpStatus.OK, formattedResult, 'List of Material Type');
  }

  async findOne(id: string) {
    const result = await this.findById(id);
    if (result) {
      return apiSuccess(HttpStatus.OK, result, 'Material Type found');
    }
    return apiSuccess(HttpStatus.NOT_FOUND, result, 'Material Type not found');
  }

  update(id: number, updateMaterialTypeDto: UpdateMaterialTypeDto) {
    return `This action updates a #${id} materialType`;
  }

  remove(id: number) {
    return `This action removes a #${id} materialType`;
  }
}
