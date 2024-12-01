import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, Prisma.LogLevel>
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
      ],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Database connected');
    } catch (error) {
      this.logger.log('Database connection failed', error);
      throw new HttpException(
        'Database connection failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    this.$use(this.softDeleteMiddleware);
    this.$use(this.findNotDeletedMiddleware);
    this.$use(this.generateCodeMiddleware);

    // this.$on('error', ({ message }) => {
    //   this.logger.error(message);
    // });
    // this.$on('warn', ({ message }) => {
    //   this.logger.warn(message);
    // });
    this.$on('info', ({ message }) => {
      this.logger.debug(message);
    });
    // this.$on('query', ({ query, params }) => {
    //   this.logger.log(`${query}; ${params}`);
    // });
  }

  private notSoftDeletedTables: string[] = ['Role', 'RefreshToken'];

  findNotDeletedMiddleware: Prisma.Middleware = async (params, next) => {
    if (this.notSoftDeletedTables.indexOf(params.model) !== -1) {
      return next(params);
    }
    if (
      params.action.startsWith('find') ||
      params.action === 'aggregate' ||
      params.action === 'count' ||
      params.action === 'groupBy'
    ) {
      addDeletedAtNull(params.args);

      return next(params);
    }
    return next(params);
  };

  softDeleteMiddleware: Prisma.Middleware = async (params, next) => {
    if (this.notSoftDeletedTables.indexOf(params.model) !== -1) {
      return next(params);
    }
    if (params.action === 'delete') {
      return next({
        ...params,
        action: 'update',
        args: {
          ...params.args,
          data: {
            deletedAt: new Date(),
          },
        },
      });
    }
    if (params.action === 'deleteMany') {
      return next({
        ...params,
        action: 'updateMany',
        args: {
          ...params.args,
          data: {
            deletedAt: new Date(),
          },
        },
      });
    }

    return next(params);
  };

  modelsWithCode: Prisma.ModelName[] = [
    'ImportRequest',
    'ImportReceipt',
    'InspectionRequest',
    'InspectionReport',
    'InventoryReport',
    'InventoryReportPlan',
    'InventoryReportPlanDetail',
    'MaterialInspectionCriteria',
    'MaterialVariant',
    'Material',
    'MaterialPackage',
    'ProductInspectionCriteria',
    'ProductSize',
    'ProductVariant',
    'Product',
    'ProductionBatch',
    'ProductionPlan',
    'ProductReceipt',
    'MaterialReceipt',
    'PoDelivery',
    'Supplier',
    'PurchaseOrder',
    'ProductionPlanDetail',
    'Task',
    'Todo',
    'ProductFormula',
    'MaterialExportRequest',
    'MaterialExportReceipt',
  ];

  getPrefix(modelName: string, delimiter: string): string {
    return modelName
      .match(/[A-Z][a-z]*|[A-Z]+(?![a-z])/g)
      .map((part) => part.slice(0, 3).toUpperCase())
      .join(delimiter);
  }

  generateCodeMiddleware: Prisma.Middleware = async (params, next) => {
    const delimiter: string = '-';
    if (
      (params.action === 'create' || params.action === 'createMany') &&
      this.modelsWithCode.includes(params.model)
    ) {
      const modelName = params.model;
      const prefix = this.getPrefix(modelName, delimiter);

      // Find the maximum existing code number
      const lastRecord = await this[modelName].findFirst({
        orderBy: { code: 'desc' },
        select: { code: true },
      });

      let lastNumber = 0;
      if (lastRecord && lastRecord.code) {
        const match = lastRecord.code.match(/\d+$/);
        if (match) {
          lastNumber = parseInt(match[0], 10);
        }
      }

      if (params.action === 'create') {
        if (params.args.data && params.args.data.code === undefined) {
          const nextNumber = (lastNumber + 1).toString().padStart(6, '0');
          params.args.data.code = `${prefix}${delimiter}${nextNumber}`;
        }
      } else if (params.action === 'createMany') {
        if (params.args.data && Array.isArray(params.args.data)) {
          params.args.data.forEach((item, index) => {
            if (item.code === undefined) {
              const nextNumber = (lastNumber + index + 1)
                .toString()
                .padStart(6, '0');
              item.code = `${prefix}${delimiter}${nextNumber}`;
            }
          });
        }
      }
    }
    return next(params);
  };

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Database disconnected');
  }
}

export const addDeletedAtNull = (obj: any) => {
  if (obj && typeof obj === 'object') {
    Object.keys(obj).forEach((key) => {
      if (key === 'where' && typeof obj[key] === 'object') {
        if (!obj[key].deletedAt) {
          obj[key].deletedAt = null;
        }
        addDeletedAtNull(obj[key]);
      } else if (typeof obj[key] === 'object') {
        addDeletedAtNull(obj[key]);
      }
    });
  }
};
