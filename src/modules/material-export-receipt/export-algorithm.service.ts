import { Injectable, Logger } from '@nestjs/common';
import { ExportAlgorithmParam as ExportAlgorithmParams } from './dto/export-algorithm-param.type';
import { ExportAlgorithmResults } from './dto/export-algorithm-result.dto';
import { NotEnoughQuantityException } from './exception/not-enough-quantity.exception';

@Injectable()
export class ExportAlgorithmService {
  private readonly logger = new Logger(ExportAlgorithmService.name);

  /**
   * Finds the best quantity by pack.
   * @param targetQuantityUom The target quantity in UOM.
   * @param items The list of items to choose from.
   * @param sortOrder The order to sort the items by date ('asc' or 'desc').
   * @returns A promise that resolves to an array of items with the best quantity by pack.
   * @throws {NotEnoughQuantityException} If there is not enough quantity to meet the target.
   */
  private async getBestQuantityByPack(
    exportAlgorithmParams: ExportAlgorithmParams,
    sortOrder: 'asc' | 'desc',
  ): Promise<ExportAlgorithmResults> {
    const result: ExportAlgorithmResults = [];
    for (const needMaterialVariants of exportAlgorithmParams) {
      // Sort items by date (ascending or descending order), handling null dates
      if (!needMaterialVariants?.allMaterialReceipts) {
        result.push({
          materialVariantId: needMaterialVariants.materialVariantId,
          targetQuantityUom: needMaterialVariants.targetQuantityUom,
          remainingQuantityByPack: 0,
          missingQuantityByPack: needMaterialVariants.targetQuantityUom,
          needMaterialReceipts: [],
          isFullFilled: false,
        });
        break;
      }
      const sortedItems = needMaterialVariants.allMaterialReceipts.sort(
        (a, b) => {
          if (a.date === null) return 1; // Place `a` after `b`
          if (b.date === null) return -1; // Place `b` after `a`
          return sortOrder === 'asc'
            ? a.date.getTime() - b.date.getTime()
            : b.date.getTime() - a.date.getTime();
        },
      );

      // Logger.debug(needMaterialVariants.materialVariantId);
      // Logger.debug(`Target quantity ${needMaterialVariants.targetQuantityUom}`);

      let remainingTargetQuantityUom: number =
        needMaterialVariants.targetQuantityUom;
      const needMaterialReceipts = [];

      for (const item of sortedItems) {
        if (remainingTargetQuantityUom <= 0) {
          break;
        }

        const availableQuantityUom =
          item.remainQuantityByPack * item.uomPerPack;
        const quantityUomToUse = Math.min(
          availableQuantityUom,
          remainingTargetQuantityUom,
        );
        const quantityPackToUse = Math.ceil(quantityUomToUse / item.uomPerPack);
        const needMaterialReceipt = {
          id: item.id,
          quantityByPack: quantityPackToUse,
          uomPerPack: item.uomPerPack,
          date: item.date,
        };
        needMaterialReceipts.push(needMaterialReceipt);
        remainingTargetQuantityUom -= quantityUomToUse;
      }
      result.push({
        materialVariantId: needMaterialVariants.materialVariantId,
        targetQuantityUom: needMaterialVariants.targetQuantityUom,
        remainingQuantityByPack: remainingTargetQuantityUom,
        missingQuantityByPack:
          needMaterialVariants.targetQuantityUom - remainingTargetQuantityUom,
        needMaterialReceipts: needMaterialReceipts,
        isFullFilled: remainingTargetQuantityUom <= 0,
      });
      // this.logger.debug({
      //   materialVariantId: needMaterialVariants.materialVariantId,
      //   targetQuantityUom: needMaterialVariants.targetQuantityUom,
      //   needMaterialReceipts: needMaterialReceipts,
      //   isFullFilled: remainingTargetQuantityUom <= 0,
      // });
      // Logger.debug(
      //   `remairemainingTargetQuantityUom ${remainingTargetQuantityUom}`,
      // );
    }
    return result;
  }

  async getBestQuantityByPackFEFO(
    exportAlgorithmParam: ExportAlgorithmParams,
  ): Promise<ExportAlgorithmResults> {
    return this.getBestQuantityByPack(exportAlgorithmParam, 'asc');
  }

  async getBestQuantityByPackFIFO(
    exportAlgorithmParam: ExportAlgorithmParams,
  ): Promise<ExportAlgorithmResults> {
    return this.getBestQuantityByPack(exportAlgorithmParam, 'desc');
  }

  async getBestQuantityByPackLIFO(
    exportAlgorithmParam: ExportAlgorithmParams,
  ): Promise<ExportAlgorithmResults> {
    return this.getBestQuantityByPack(exportAlgorithmParam, 'asc');
  }
}
