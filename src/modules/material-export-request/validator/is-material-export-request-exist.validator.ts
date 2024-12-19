import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';

@ValidatorConstraint({
  async: true,
})
@Injectable()
export class IsMaterialExportRequestExistValidator
  implements ValidatorConstraintInterface
{
  constructor(private readonly prismaService: PrismaService) {}
  async validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    let materialExportRequestId: string;
    try {
      materialExportRequestId = value as string;
    } catch (error) {
      return false;
    }
    const materialExportRequest =
      await this.prismaService.materialExportRequest.findFirst({
        where: {
          id: materialExportRequestId,
        },
        select: {
          id: true,
        },
      });
    return !!materialExportRequest;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return 'Material export request does not exist';
  }
}

export function IsMaterialExportRequestExist() {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: {},
      constraints: [],
      validator: IsMaterialExportRequestExistValidator,
    });
  };
}
