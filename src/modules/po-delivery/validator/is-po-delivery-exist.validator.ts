import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PoDeliveryService } from '../po-delivery.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsPoDeliveryExistValidator
  implements ValidatorConstraintInterface
{
  constructor(private readonly poDeliveryService: PoDeliveryService) {}
  async validate(
    value: string,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    if (!value) return false;
    const poDelivery = await this.poDeliveryService.findById(value);
    return !!poDelivery;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return "Po Delivery doesn't exist";
  }
}

export function IsPoDeliveryExist(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPoDeliveryExistValidator,
      async: true,
    });
  };
}
