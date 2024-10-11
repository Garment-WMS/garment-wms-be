import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { InspectionRequestService } from '../inspection-request.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsInspectionRequestExistValidator
  implements ValidatorConstraintInterface
{
  constructor(
    private readonly inspectionRequestService: InspectionRequestService,
  ) {}
  async validate(inspectionRequestId: string) {
    const inspectionRequest =
      await this.inspectionRequestService.findFirst(inspectionRequestId);
    return !!inspectionRequest;
  }

  defaultMessage() {
    return 'Inspection request does not exist';
  }
}

export function IsInspectionRequestExist() {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: {},
      constraints: [],
      validator: IsInspectionRequestExistValidator,
      async: true,
    });
  };
}
