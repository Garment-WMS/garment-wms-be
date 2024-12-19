import { Logger } from '@nestjs/common';
import { addDeletedAtNull, PrismaService } from './prisma.service';

describe('addDeletedAtNull', () => {
  it('should add deletedAt: null to top-level where clause', () => {
    const params = { where: { status: 'active' } } as any;
    addDeletedAtNull(params);
    expect(params.where.deletedAt).toBeNull();
  });

  it('should add deletedAt: null to nested where clause', () => {
    const params = {
      where: { status: 'active', nested: { where: { status: 'inactive' } } },
    } as any;
    addDeletedAtNull(params);
    expect(params.where.deletedAt).toBeNull();
    expect(params.where.nested.where.deletedAt).toBeNull();
  });

  it('should not overwrite existing deletedAt value', () => {
    const params = {
      where: { status: 'active', deletedAt: '2023-01-01' },
    } as any;
    addDeletedAtNull(params);
    expect(params.where.deletedAt).toBe('2023-01-01');
  });

  it('should handle objects without where clause', () => {
    const params = { status: 'active' } as any;
    addDeletedAtNull(params);
    expect(params.deletedAt).toBeUndefined();
  });

  it('should handle deeply nested where clauses', () => {
    const params = {
      where: {
        status: 'active',
        nested: {
          where: {
            status: 'inactive',
            deepNested: {
              where: { status: 'pending' },
            },
          },
        },
      },
    } as any;
    addDeletedAtNull(params);
    expect(params.where.deletedAt).toBeNull();
    expect(params.where.nested.where.deletedAt).toBeNull();
    expect(params.where.nested.where.deepNested.where.deletedAt).toBeNull();
  });
});

//test getPrefix
describe('getPrefix', () => {
  it('should return the first 3 characters of the model name in uppercase', () => {
    const service = new PrismaService();
    const modelsWithCode = [
      'ImportRequest',
      'ImportReceipt',
      'InspectionRequest',
      'InspectionReport',
      'MaterialInspectionCriteria',
      'MaterialVariant',
      'Material',
      'MaterialPackage',
      'ProductInspectionCriteria',
      'ProductSize',
      'ProductVariant',
      'Product',
      'ProductBatch',
      'ProductionPlan',
      'Supplier',
    ];
    const delimiter = '-';
    const expectedPrefixes = [
      'IMP-REQ',
      'IMP-REC',
      'INS-REQ',
      'INS-REP',
      'MAT-INS-CRI',
      'MAT-VAR',
      'MAT',
      'MAT-PAC',
      'PRO-INS-CRI',
      'PRO-SIZ',
      'PRO-VAR',
      'PRO',
      'PRO-BAT',
      'PRO-PLA',
      'SUP',
    ];
    modelsWithCode.forEach((model, index) => {
      Logger.log(model);
      expect(service.getPrefix(model, delimiter)).toBe(expectedPrefixes[index]);
    });
  });
});
