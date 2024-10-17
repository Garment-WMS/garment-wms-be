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
      this.logger.log('Database connection failed');
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
      (params.action.startsWith('find') ||
        params.action === 'aggregate' ||
        params.action === 'count' ||
        params.action === 'groupBy') &&
      !params.args?.['where']?.['deletedAt']
    ) {
      return next({
        ...params,
        args: {
          ...params.args,
          where: {
            ...params.args?.['where'],
            deletedAt: null,
          },
        },
      });
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

  modelsWithCode = [
    'AnnualProductionPlan',
    'ImportReceipt',
    'InspectionReport',
    'ManufacturingOrder',
    'MaterialInspectionCriteria',
    'MaterialType',
    'MaterialVariant',
    'Material',
    'ProductInspectionCriteria',
    'ProductType',
    'ProductVariant',
    'Product',
    'QuarterlyProductionPlan',
    'Supplier',
  ];

  generateCodeMiddleware: Prisma.Middleware = async (params, next) => {
    if (
      (params.action === 'create' || params.action === 'createMany') &&
      this.modelsWithCode.includes(params.model)
    ) {
      const modelName = params.model;
      const prefix = modelName
        .split(/(?=[A-Z])/)
        .map((word) => word.charAt(0).toUpperCase())
        .join('');

      if (params.action === 'create') {
        if (params.args.data && params.args.data.code === undefined) {
          // Count the existing records in the table
          const count = await this[modelName].count();
          const nextNumber = (count + 1).toString().padStart(6, '0');
          const code = `${prefix}${nextNumber}`;
          params.args.data.code = code;
        }
      } else if (params.action === 'createMany') {
        if (params.args.data && Array.isArray(params.args.data)) {
          const count = await Prisma[modelName.toLowerCase()].count();
          params.args.data.forEach((item, index) => {
            if (item.code === undefined) {
              const nextNumber = (count + index + 1)
                .toString()
                .padStart(6, '0');
              const code = `${prefix}${nextNumber}`;
              item.code = code;
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
