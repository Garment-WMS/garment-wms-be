import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { ProductionBatchService } from '../production-batch.service';

@Injectable()
export class IsProductionBatchExistPipe implements PipeTransform {
  constructor(readonly productionBatchService: ProductionBatchService) {}
  async transform(value: any, metadata: ArgumentMetadata) {
    if (!isUUID(value))
      throw new BadRequestException('Production batch id must be a UUID');
    const productionBatch = await this.productionBatchService.findFirst(value);
    if (!productionBatch)
      throw new BadRequestException('Production batch not exists');
    return value;
  }
}
