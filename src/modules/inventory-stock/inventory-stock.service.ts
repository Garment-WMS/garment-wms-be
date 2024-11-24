import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { apiSuccess } from 'src/common/dto/api-response';
import { MaterialVariantService } from '../material-variant/material-variant.service';
import { ProductVariantService } from '../product-variant/product-variant.service';
import { CreateInventoryStockDto } from './dto/create-inventory-stock.dto';
import { MaterialStock } from './dto/stock-material.dto';
import { UpdateInventoryStockDto } from './dto/update-inventory-stock.dto';

@Injectable()
export class InventoryStockService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly materialVariantService: MaterialVariantService,
    private readonly productVariantService: ProductVariantService,
  ) {}

  async getInvetoryStockDashboard() {
    const materialInventoryStock =
      await this.prismaService.inventoryStock.findMany({
        where: { materialPackageId: { not: null } },
        include: { materialPackage: { include: { materialVariant: true } } },
      });

    const productInventoryStock =
      await this.prismaService.inventoryStock.findMany({
        where: { productSizeId: { not: null } },
        include: { productSize: { include: { productVariant: true } } },
      });

    const allMaterialVariants =
      await this.materialVariantService.findAllWithoutResponseMinimizeInlude();
    const allProductVariants =
      await this.productVariantService.findAllWithoutResponseMinimizeInclude();

    const numberOfMaterialStock = materialInventoryStock.reduce(
      (acc, item) => acc + item.quantityByPack,
      0,
    );
    const numberOfProductStock = productInventoryStock.reduce(
      (acc, item) => acc + item.quantityByUom,
      0,
    );

    const materialDistribution = allMaterialVariants.reduce((acc, variant) => {
      acc[variant.id] = {
        materialVariant: variant,
        quantity: 0,
      };
      return acc;
    }, {});

    materialInventoryStock.forEach((item) => {
      const variantId = item.materialPackage.materialVariant.id;
      materialDistribution[variantId].quantity += item.quantityByPack;
    });

    const productDistribution = allProductVariants.reduce((acc, variant) => {
      acc[variant.id] = {
        productVariant: variant,
        quantity: 0,
      };
      return acc;
    }, {});

    productInventoryStock.forEach((item) => {
      const variantId = item.productSize.productVariant.id;
      productDistribution[variantId].quantity += item.quantityByUom;
    });

    const materialPercentageDistribution = Object.values(
      materialDistribution,
    ).map((variant: any) => ({
      ...variant,
      percentage: parseFloat(
        ((variant.quantity / numberOfMaterialStock) * 100 || 0).toFixed(2),
      ),
    }));

    const productPercentageDistribution = Object.values(
      productDistribution,
    ).map((variant: any) => ({
      ...variant,
      percentage: parseFloat(
        ((variant.quantity / numberOfProductStock) * 100 || 0).toFixed(2),
      ),
    }));

    return apiSuccess(
      HttpStatus.OK,
      {
        overAllQualityRate: await this.getQualityRate(),
        numberOfMaterialStock,
        numberOfProductStock,
        materialQualityRate: await this.getMaterialQualityRate(),
        materialDistribution: materialPercentageDistribution,
        productDistribution: productPercentageDistribution,
        productQualityRate: await this.getProductQualityRate(),
      },
      'Get inventory stock dashboard successfully',
    );
  }

  async getQualityRate() {
    const inspectedReportDetail =
      await this.prismaService.inspectionReportDetail.findMany({});
    const [numberOfApproveQuantity, numberOfDefectQuantity] =
      inspectedReportDetail.reduce(
        (acc, item) => {
          return [
            acc[0] + item.approvedQuantityByPack,
            acc[1] + item.defectQuantityByPack,
          ];
        },
        [0, 0],
      );
    const qualityRate =
      numberOfApproveQuantity /
      (numberOfApproveQuantity + numberOfDefectQuantity);

    const roundedQualityRate = parseFloat((qualityRate * 100).toFixed(2));

    return roundedQualityRate;
  }

  async getMaterialQualityRate() {
    const inspectedReportDetail =
      await this.prismaService.inspectionReportDetail.findMany({
        where: {
          materialPackageId: {
            not: null,
          },
        },
      });
    const [numberOfApproveQuantity, numberOfDefectQuantity] =
      inspectedReportDetail.reduce(
        (acc, item) => {
          return [
            acc[0] + item.approvedQuantityByPack,
            acc[1] + item.defectQuantityByPack,
          ];
        },
        [0, 0],
      );
    const qualityRate =
      numberOfApproveQuantity /
      (numberOfApproveQuantity + numberOfDefectQuantity);

    const roundedQualityRate = parseFloat((qualityRate * 100).toFixed(2));

    return roundedQualityRate;
  }

  async getProductQualityRate() {
    const inspectedReportDetail =
      await this.prismaService.inspectionReportDetail.findMany({
        where: {
          productSizeId: {
            not: null,
          },
        },
      });
    const [numberOfApproveQuantity, numberOfDefectQuantity] =
      inspectedReportDetail.reduce(
        (acc, item) => {
          return [
            acc[0] + item.approvedQuantityByPack,
            acc[1] + item.defectQuantityByPack,
          ];
        },
        [0, 0],
      );
    const qualityRate =
      numberOfApproveQuantity /
      (numberOfApproveQuantity + numberOfDefectQuantity);

    const roundedQualityRate = parseFloat((qualityRate * 100).toFixed(2));

    return roundedQualityRate;
  }

  create(createInventoryStockDto: CreateInventoryStockDto) {
    return 'This action adds a new inventoryStock';
  }

  async updateProductStockQuantity(
    productSizeId: string,
    remainQuantityByUom: number,
    prismaInstance: PrismaService,
  ) {
    return prismaInstance.inventoryStock.upsert({
      where: {
        productSizeId: productSizeId,
      },
      update: {
        quantityByUom: remainQuantityByUom,
      },
      create: {
        productSizeId,
        quantityByUom: remainQuantityByUom,
      },
    });
  }

  async updateProductStock(
    productSizeId: string,
    quantityByUom: number,
    prismaInstance: PrismaService = this.prismaService,
  ) {
    return prismaInstance.inventoryStock.upsert({
      where: {
        productSizeId: productSizeId,
      },
      update: {
        quantityByUom:
          quantityByUom >= 0
            ? { increment: quantityByUom }
            : { decrement: Math.abs(quantityByUom) },
      },
      create: {
        productSizeId,
        quantityByUom: quantityByUom,
      },
    });
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
        quantityByPack:
          quantity >= 0
            ? { increment: quantity }
            : { decrement: Math.abs(quantity) },
      },
      create: {
        materialPackageId,
        quantityByPack: quantity,
      },
    });
  }

  updateMaterialStockQuantity(
    materialPackageId: string,
    quantity: number,
    prismaInstance: PrismaClient = this.prismaService,
  ) {
    return prismaInstance.inventoryStock.upsert({
      where: {
        materialPackageId: materialPackageId,
      },
      update: {
        quantityByPack: quantity,
      },
      create: {
        materialPackageId,
        quantityByPack: quantity,
      },
    });
  }

  reCount() {
    throw new Error('Method not implemented.');
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
