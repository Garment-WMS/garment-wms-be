import { Injectable } from '@nestjs/common';
import { registerDecorator, ValidatorConstraint } from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsProductionPlanDetailExistValidator {
  constructor(readonly prismaService: PrismaService) {}
  async validate(value: any): Promise<boolean> {
    const isExist = await this.prismaService.productionPlanDetail.findUnique({
      where: { id: value },
    });
    return !!isExist;
  }
  defaultMessage?(): string {
    return "Production plan detail doesn't exist";
  }
}

export function IsProductionPlanDetailExist() {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: {},
      constraints: [],
      validator: IsProductionPlanDetailExistValidator,
      async: true,
    });
  };
}
