import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { apiFailed, apiSuccess } from 'src/common/dto/api-response';
import { CreateSupplierDto } from './dto/create-supplier.dto';

@Injectable()
export class SupplierService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    const result = await this.prismaService.supplier.findMany();
    if (result) {
      return apiSuccess(HttpStatus.OK, result, 'Supplier fetched successfully');
    }
    return apiFailed(HttpStatus.BAD_REQUEST, 'Failed to fetch Supplier');
  }

  async create(createSupplierDto: CreateSupplierDto) {
    const result = await this.prismaService.supplier.create({
      data: createSupplierDto,
    });
    if (result) {
      return apiSuccess(
        HttpStatus.CREATED,
        result,
        'Supplier created successfully',
      );
    }
    return apiFailed(HttpStatus.BAD_REQUEST, 'Failed to create Supplier');
  }

  async findSupplier(query) {
    return this.prismaService.supplier.findFirst({
      where: { ...query },
    });
  }

  async findSupplierBySupplierCode(supplierCode: string) {
    return this.prismaService.supplier.findFirst({
      where: { code: supplierCode },
    });
  }
}
