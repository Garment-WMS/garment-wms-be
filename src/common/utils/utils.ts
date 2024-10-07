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

export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

import * as bcrypt from 'bcrypt';
import { isDate } from 'class-validator';
import { Constant } from '../constant/constant';

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

  for (const item of arr1) {
    frequencyMap.set(item, (frequencyMap.get(item) || 0) + 1);
  }

  for (const item of arr2) {
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

export function validateDate(date: string): boolean {
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
