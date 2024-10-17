import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { apiSuccess } from 'src/common/dto/api-response';
import { MaterialService } from '../material/material.service';
import { ProductService } from '../product/product.service';
import { CreateInventoryStockDto } from './dto/create-inventory-stock.dto';
import { MaterialStock } from './dto/stock-material.dto';
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
    // const inventoryStocks = await this.materialService.findMaterialStock();
    const inventoryStocks = await this.prismaService.material.findMany({
      include: {
        materialAttribute: true,
        materialType: true,
        materialUom: true,
        materialVariant: {
          include: {
            inventoryStock: true,
          },
        },
      },
    });

    inventoryStocks.forEach((material: MaterialStock) => {
      material.numberOfMaterialVariant = material.materialVariant.length;
      material.onHand = material?.materialVariant?.reduce(
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
