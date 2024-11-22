import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsMaterialReceiptExportReceiptExistValidator
  implements ValidatorConstraintInterface
{
  constructor(private readonly prismaService: PrismaService) {}
  async validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    let materialReceiptId: string;
    try {
      materialReceiptId = value as string;
    } catch (error) {
      return false;
    }
    const materialReceipt =
      await this.prismaService.materialExportReceipt.findFirst({
        where: {
          id: materialReceiptId,
        },
        select: {
          id: true,
        },
      });
    return !!materialReceipt;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return 'Material export receipt does not exist';
  }
}

export function IsMaterialExportReceiptExist() {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: {},
      constraints: [],
      validator: IsMaterialReceiptExportReceiptExistValidator,
    });
  };
}
