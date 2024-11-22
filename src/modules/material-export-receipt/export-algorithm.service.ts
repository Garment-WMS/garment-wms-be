import { Injectable, Logger } from '@nestjs/common';
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
    targetQuantityUom: number,
    items: {
      id: string;
      quantityByPack: number;
      uomPerPack: number;
      date: Date | null;
    }[],
    sortOrder: 'asc' | 'desc',
  ): Promise<
    | {
        id: string;
        quantityByPack: number;
      }[]
    | null
  > {
    // Sort items by date (ascending or descending order), handling null dates
    const sortedItems = items.sort((a, b) => {
      if (a.date === null) return 1; // Place `a` after `b`
      if (b.date === null) return -1; // Place `b` after `a`
      return sortOrder === 'asc'
        ? a.date.getTime() - b.date.getTime()
        : b.date.getTime() - a.date.getTime();
    });

    let remainingTargetQuantityUom = targetQuantityUom;
    const result: { id: string; quantityByPack: number }[] = [];

    for (const item of sortedItems) {
      if (remainingTargetQuantityUom <= 0) {
        break;
      }

      const availableQuantityUom = item.quantityByPack * item.uomPerPack;
      const quantityUomToUse = Math.min(
        availableQuantityUom,
        remainingTargetQuantityUom,
      );
      const quantityPackToUse = Math.ceil(quantityUomToUse / item.uomPerPack);

      result.push({
        id: item.id,
        quantityByPack: quantityPackToUse,
      });

      remainingTargetQuantityUom -= quantityUomToUse;
    }
    if (remainingTargetQuantityUom > 0) {
      return null;
    }
    this.logger.debug('Log first', result);
    return result;
  }

  async getBestQuantityByPackFEFO(
    targetQuantityUom: number,
    items: {
      id: string;
      quantityByPack: number;
      uomPerPack: number;
      expireDate: Date | null;
    }[],
  ): Promise<
    | {
        id: string;
        quantityByPack: number;
      }[]
    | null
  > {
    // Map expireDate to date for sorting
    const itemsWithDate = items.map((item) => ({
      ...item,
      date: item.expireDate,
    }));

    return this.getBestQuantityByPack(targetQuantityUom, itemsWithDate, 'asc');
  }

  async getBestQuantityByPackFIFO(
    targetQuantityUom: number,
    items: {
      id: string;
      quantityByPack: number;
      uomPerPack: number;
      date: Date | null;
    }[],
  ): Promise<
    {
      id: string;
      quantityByPack: number;
    }[]
  > {
    // Map importDate to date for sorting
    const itemsWithDate = items.map((item) => ({
      ...item,
      date: item.date,
    }));

    return this.getBestQuantityByPack(targetQuantityUom, itemsWithDate, 'asc');
  }

  async getBestQuantityByPackLIFO(
    targetQuantityUom: number,
    items: {
      id: string;
      quantityByPack: number;
      uomPerPack: number;
      date: Date | null;
    }[],
  ): Promise<
    | {
        id: string;
        quantityByPack: number;
      }[]
    | null
  > {
    // Map importDate to date for sorting
    const itemsWithDate = items.map((item) => ({
      ...item,
      date: item.date,
    }));

    return this.getBestQuantityByPack(targetQuantityUom, itemsWithDate, 'desc');
  }
}
