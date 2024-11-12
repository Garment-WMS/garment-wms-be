import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { allowActionImportRequestStatus } from '../enum/allow-action-import-request-status.enum';
import { ImportRequestService } from '../import-request.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsImportReqStatusCanCreateInspectionReqValidator
  implements ValidatorConstraintInterface
{
  constructor(private readonly importRequestService: ImportRequestService) {}
  async validate(
    value: string,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    const allowCreateInspectionRequestStatus =
      allowActionImportRequestStatus.allowCreateInspectionRequestStatus;

    const importRequestId = value;

    const importRequest =
      await this.importRequestService.findUnique(importRequestId);

    if (!importRequest) {
      return false;
    }

    return allowCreateInspectionRequestStatus.includes(importRequest.status);
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return `Allowed Import Request Status to create Inspection Request: ${allowActionImportRequestStatus.allowCreateInspectionRequestStatus.join(
      ', ',
    )}`;
  }
}

export function IsImportReqStatusCanCreateInspectionReq() {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: {},
      constraints: [],
      validator: IsImportReqStatusCanCreateInspectionReqValidator,
      async: true,
    });
  };
}
