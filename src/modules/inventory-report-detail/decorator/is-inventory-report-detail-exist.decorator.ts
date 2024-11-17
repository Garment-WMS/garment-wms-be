import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { InventoryReportDetailService } from '../inventory-report-detail.service';

@Injectable()
export class IsInventoryReportDetailExistPipe implements PipeTransform {
  constructor(
    private readonly inventoryReportDetail: InventoryReportDetailService,
  ) {}
  async transform(value: any, metadata: ArgumentMetadata) {
    const inventoryReportDetail =
      await this.inventoryReportDetail.isInventoryReportDetailExist(value);
    if (!inventoryReportDetail) {
      throw new NotFoundException(
        `Inventory report detail with id ${value} not found`,
      );
    }
    return value;
  }
}
