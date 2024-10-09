import { Injectable } from '@nestjs/common';
import { RoleCode } from '@prisma/client';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserService } from '../user.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsUserRoleExistValidator implements ValidatorConstraintInterface {
  constructor(private readonly userService: UserService) {}
  async validate(
    value: string,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    const role = validationArguments.constraints[0] as RoleCode;
    if (!value) return false;
    console.log(value, role);
    const user = await this.userService.IsUserRoleExist(value, role);
    console.log(user);
    return !!user;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return `User with id ${validationArguments.value} and role ${validationArguments.constraints[0]} not found`;
  }
}

export function IsUserRoleExist(
  allowedRoles: RoleCode,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [allowedRoles],
      validator: IsUserRoleExistValidator,
      async: true,
    });
  };
}
