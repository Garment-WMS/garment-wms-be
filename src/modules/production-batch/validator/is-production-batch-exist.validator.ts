import { Injectable } from '@nestjs/common';
import {
  isUUID,
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ProductionBatchService } from '../production-batch.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsProductionBatchExistValidator
  implements ValidatorConstraintInterface
{
  constructor(readonly productionBatchService: ProductionBatchService) {}
  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> | boolean {
    if (!isUUID(value)) return false;
    const productionBatch = this.productionBatchService.findFirst(value);
    return !!productionBatch;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return "Production Batch doesn't exist";
  }
}

export function IsProductionBatchExist() {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      validator: IsProductionBatchExistValidator,
      async: true,
      name: 'isProductionBatchExist',
    });
  };
}
