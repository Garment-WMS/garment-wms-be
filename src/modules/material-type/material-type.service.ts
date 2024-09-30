import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { apiSuccess } from 'src/common/dto/api-response';
import { CreateMaterialTypeDto } from './dto/create-material-type.dto';
import { UpdateMaterialTypeDto } from './dto/update-material-type.dto';

@Injectable()
export class MaterialTypeService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createMaterialTypeDto: CreateMaterialTypeDto) {
    const result = await this.prismaService.materialType.create({
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

  async findAll() {
    const result = await this.prismaService.materialType.findMany();
    return apiSuccess(HttpStatus.OK, result, 'List of Material Type');
  }

  async findOne(id: string) {
    const result = await this.prismaService.materialType.findFirst({
      where: { id },
    });
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
