import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsMaterialReceiptExistValidator
  implements ValidatorConstraintInterface
{
  constructor(private readonly prismaService: PrismaService) {}

  async validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    if (!value) {
      return false;
    }
    let materialReceiptId: string;
    try {
      materialReceiptId = value as string;
    } catch (error) {
      return false;
    }
    return (
      (await this.prismaService.materialReceipt.findFirst({
        where: {
          id: materialReceiptId,
        },
        select: {
          id: true,
        },
      })) !== null
    );
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `Material receipt with ID ${validationArguments?.value} does not exist.`;
  }
}

export function IsMaterialReceiptExist(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsMaterialReceiptExistValidator,
    });
  };
}
