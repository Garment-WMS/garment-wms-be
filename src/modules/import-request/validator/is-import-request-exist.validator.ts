import { Injectable, Logger } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsImportRequestExistValidator
  implements ValidatorConstraintInterface
{
  constructor(private readonly prismaService: PrismaService) {}
  async validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    const isExist = await this.prismaService.importRequest.findFirst({
      where: { id: value },
      select: { id: true },
    });
    Logger.debug(await this.prismaService.importRequest.findFirst());
    Logger.debug(isExist);
    return !!isExist;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return "Import request doesn't exist";
  }
}

export function IsImportRequestExist() {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: {},
      constraints: [],
      validator: IsImportRequestExistValidator,
      async: true,
    });
  };
}
