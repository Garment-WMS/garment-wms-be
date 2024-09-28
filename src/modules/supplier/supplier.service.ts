import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class SupplierService {
  constructor(private readonly prismaService: PrismaService) {}

  async findSupplier(query) {
    return this.prismaService.supplier.findFirst({
      where: { ...query },
    });
  }

  async findSupplierBySupplierCode(supplierCode: string) {
    return this.prismaService.supplier.findFirst({
      where: { supplier_code: supplierCode },
    });
  }
}
