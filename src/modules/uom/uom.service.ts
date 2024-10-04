import { HttpStatus, Injectable } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { CreateUomDto } from './dto/create-uom.dto';
import { UpdateUomDto } from './dto/update-uom.dto';

@Injectable()
export class UomService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createUomDto: CreateUomDto) {
    const result = await this.prismaService.uom.create({
      data: { ...createUomDto },
    });
    if (result) {
      return apiSuccess(HttpStatus.CREATED, result, 'UOM created successfully');
    }
    return apiFailed(HttpStatus.BAD_REQUEST, 'Failed to create UOM');
  }

  async findById(id: string) {
    if (!isUUID(id)) {
      return null;
    }
    const result = await this.prismaService.uom.findUnique({
      where: { id },
    });
    return result;
  }

  async findOne(id: string) {
    const result = await this.findById(id);

    if (result) {
      return apiSuccess(HttpStatus.OK, result, 'UOM found');
    }
    return apiFailed(HttpStatus.NOT_FOUND, 'UOM not found');
  }

  async findAll() {
    const result = await this.prismaService.uom.findMany();
    return apiSuccess(HttpStatus.OK, result, 'UOMs found');
  }

  async findByUomName(name: string) {
    const result = await this.prismaService.uom.findMany({
      where: { name },
    });
    return result;
  }

  async update(id: string, updateUomDto: UpdateUomDto) {
    const result = await this.prismaService.uom.update({
      where: { id },
      data: { ...updateUomDto },
    });
    if (result) {
      return apiSuccess(HttpStatus.OK, result, 'UOM updated successfully');
    }
    return apiFailed(HttpStatus.BAD_REQUEST, 'Failed to update UOM');
  }
}
