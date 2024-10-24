import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { apiSuccess } from 'src/common/dto/api-response';
import { MaterialVariantService } from '../material-variant/material-variant.service';
import { CreateInventoryStockDto } from './dto/create-inventory-stock.dto';
import { MaterialStock } from './dto/stock-material.dto';
import { UpdateInventoryStockDto } from './dto/update-inventory-stock.dto';

@Injectable()
export class InventoryStockService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly materialVariantService: MaterialVariantService,
  ) {}

  create(createInventoryStockDto: CreateInventoryStockDto) {
    return 'This action adds a new inventoryStock';
  }

  async findAll() {
    const inventoryStocks =
      await this.materialVariantService.findMaterialStock();
    inventoryStocks.forEach((material: MaterialStock) => {
      material.numberOfMaterialVariant = material.materialPackage.length;
      material.onHand = material?.materialPackage?.reduce(
        (totalAcc, materialVariantEl) => {
          let variantTotal = 0;
          //Invenotory stock is 1 - 1 now, if 1 - n then need to change to use reduce
          if (materialVariantEl.inventoryStock) {
            variantTotal = materialVariantEl.inventoryStock.quantityByPack;
          }
          return totalAcc + variantTotal;
        },
        0,
      );
    });

    return apiSuccess(
      HttpStatus.OK,
      inventoryStocks,
      'Get all inventory stock successfully',
    );
  }

  updateMaterialStock(
    materialPackageId: string,
    quantity: number,
    prismaInstance: PrismaClient = this.prismaService,
  ) {
    return prismaInstance.inventoryStock.upsert({
      where: {
        materialPackageId: materialPackageId,
      },
      update: {
        quantityByPack: { increment: quantity },
      },
      create: {
        materialPackageId,
        quantityByPack: quantity,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} inventoryStock`;
  }

  update(id: number, updateInventoryStockDto: UpdateInventoryStockDto) {
    return `This action updates a #${id} inventoryStock`;
  }

  remove(id: number) {
    return `This action removes a #${id} inventoryStock`;
  }
}
