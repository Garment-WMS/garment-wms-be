export const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const generateOTP = (length: number = 6): string => {
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10).toString();
  }
  return otp;
};

export function getDatePart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

import { PoDeliveryStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { isDate } from 'class-validator';
import { Constant } from '../constant/constant';
import { PageMeta } from '../dto/page-meta';

export const hashData = async (data: string): Promise<string> => {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(data, salt);
};

export const compareHash = async (
  data: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(data, hash);
};

export const getPagination = (
  page: number,
  size: number,
  totalItems: number,
) => {
  const totalPages = Math.ceil(totalItems / size);
  return { page, size, totalPages, totalItems };
};

export const logger = (message: string, level: 'info' | 'error' = 'info') => {
  console[level](
    `[${new Date().toISOString()}] [${level.toUpperCase()}] - ${message}`,
  );
};

export const compareArray = (arr1: any[], arr2: any[]): boolean => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  const frequencyMap = new Map();

  const normalize = (item: any) =>
    typeof item === 'string' ? item.toLowerCase() : item;

  for (let item of arr1) {
    item = normalize(item);
    frequencyMap.set(item, (frequencyMap.get(item) || 0) + 1);
  }

  for (let item of arr2) {
    item = normalize(item);
    if (!frequencyMap.has(item)) {
      return false;
    }
    const count = frequencyMap.get(item) - 1;
    if (count === 0) {
      frequencyMap.delete(item);
    } else {
      frequencyMap.set(item, count);
    }
  }

  return frequencyMap.size === 0;
};

export function addMissingStartCharacter(
  value: any,
  character: string,
): string {
  if (!value) {
    return '';
  }
  value = value.toString();
  if (!value.startsWith(character)) {
    return `${character}${value}`;
  }
  return value;
}

export function validateDate(date: any): boolean {
  console.log(date);
  return isDate(date);
}

export function extractPageAndPageSize(findOptions): {
  offset: number;
  limit: number;
} {
  const offset = findOptions?.skip || Constant.DEFAULT_OFFSET;
  const limit = findOptions?.take || Constant.DEFAULT_LIMIT;
  return { offset, limit };
}

export function getPageMeta(
  total: number,
  offset: number,
  limit: number,
): PageMeta {
  const pageMeta: PageMeta = {
    total: total,
    offset: offset,
    limit: limit,
    page: Math.ceil(offset / limit) + 1,
    totalPages: Math.ceil(total / limit),
    hasNext: offset + limit < total,
    hasPrevious: offset > 0,
  };
  return pageMeta;
}

export const nonExistUUID: string = '00000000-0000-0000-0000-000000000000';

export const getPurchaseOrderStatistic = (purchaseOrder) => {
  let totalImportQuantity = 0;
  let totalQuantityToImport = 0;
  let totalFailImportQuantity = 0;

  const poDeliveryStats = purchaseOrder.poDelivery.reduce(
    (acc, poDelivery) => {
      acc.totalPoDelivery++;

      switch (poDelivery.status) {
        case PoDeliveryStatus.FINISHED:
          acc.totalFinishedPoDelivery++;
          break;
        case PoDeliveryStatus.IMPORTING:
          acc.totalInProgressPoDelivery++;
          break;
        case PoDeliveryStatus.CANCELLED:
          acc.totalCancelledPoDelivery++;
          break;
        case PoDeliveryStatus.PENDING:
          acc.totalPendingPoDelivery++;
          break;
      }

      poDelivery.poDeliveryDetail.forEach((poDeliveryDetail) => {
        if (
          poDelivery.status === PoDeliveryStatus.FINISHED &&
          !poDelivery.isExtra
        ) {
          totalFailImportQuantity +=
            poDeliveryDetail.quantityByPack -
            poDeliveryDetail.actualImportQuantity;
        }
        if (!poDelivery.isExtra) {
          totalImportQuantity += poDeliveryDetail.actualImportQuantity;
          totalQuantityToImport += poDeliveryDetail.quantityByPack;
        }
      });

      return acc;
    },
    {
      totalPoDelivery: 0,
      totalFinishedPoDelivery: 0,
      totalInProgressPoDelivery: 0,
      totalCancelledPoDelivery: 0,
      totalPendingPoDelivery: 0,
    },
  );

  purchaseOrder.totalImportQuantity = totalImportQuantity;
  purchaseOrder.totalFailImportQuantity = totalFailImportQuantity;
  purchaseOrder.totalQuantityToImport = totalQuantityToImport;

  purchaseOrder.totalPoDelivery = poDeliveryStats.totalPoDelivery;
  purchaseOrder.totalFinishedPoDelivery =
    poDeliveryStats.totalFinishedPoDelivery;
  purchaseOrder.totalInProgressPoDelivery =
    poDeliveryStats.totalInProgressPoDelivery;
  purchaseOrder.totalPendingPoDelivery = poDeliveryStats.totalPendingPoDelivery;
  purchaseOrder.totalCancelledPoDelivery =
    poDeliveryStats.totalCancelledPoDelivery;

  return [
    totalImportQuantity,
    totalFailImportQuantity,
    totalQuantityToImport,
    poDeliveryStats.totalPoDelivery,
    poDeliveryStats.totalFinishedPoDelivery,
    poDeliveryStats.totalInProgressPoDelivery,
    poDeliveryStats.totalCancelledPoDelivery,
    poDeliveryStats.totalPendingPoDelivery,
  ];
};
