import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { InventoryReportDetailService } from '../inventory-report-detail.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsInventoryReportDetailExistValidator
  implements ValidatorConstraintInterface
{
  constructor(
    private readonly inventoryReportDetail: InventoryReportDetailService,
  ) {}
  async validate(
    value: string,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    if (!value) return false;
    const inventoryReportDetail =
      await this.inventoryReportDetail.isInventoryReportDetailExist(value);
    return !!inventoryReportDetail;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return `Inventory report detail with id ${validationArguments.value} not found`;
  }
}

export function IsInventoryReportDetailExist(
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsInventoryReportDetailExistValidator,
      async: true,
    });
  };
}
