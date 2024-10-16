import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { apiSuccess } from 'src/common/dto/api-response';
import { MaterialService } from '../material/material.service';
import { ProductService } from '../product/product.service';
import { CreateInventoryStockDto } from './dto/create-inventory-stock.dto';
import { UpdateInventoryStockDto } from './dto/update-inventory-stock.dto';

@Injectable()
export class InventoryStockService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly materialService: MaterialService,
    private readonly productService: ProductService,
  ) {}

  create(createInventoryStockDto: CreateInventoryStockDto) {
    return 'This action adds a new inventoryStock';
  }

  async findAll() {
    const inventoryStocks = await this.materialService.findMaterialStock();
    inventoryStocks.forEach((material: any) => {
      material.numberOfMaterialVariant = material.materialVariant.length;

      if (material.numberOfMaterialVariant > 0) {
        material.onHand = material.materialVariant.reduce(
          (totalAcc, materialVariantEl) => {
            let variantTotal = 0;
            if (materialVariantEl.inventoryStock) {
              variantTotal = materialVariantEl.inventoryStock.quantityByPack;
            }
            return totalAcc + variantTotal;
          },
          0,
        );
      } else {
        material.onHand = 0;
      }
    });

    return apiSuccess(
      HttpStatus.OK,
      inventoryStocks,
      'Get all inventory stock successfully',
    );
  }

  updateMaterialStock(
    materialVariantId: string,
    quantity: number,
    prismaInstance: PrismaClient = this.prismaService,
  ) {
    return prismaInstance.inventoryStock.upsert({
      where: {
        materialVariantId: materialVariantId,
      },
      update: {
        quantityByPack: { increment: quantity },
      },
      create: {
        materialVariantId,
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
