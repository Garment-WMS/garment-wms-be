import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { InspectionReportService } from '../inspection-report.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsInspectionReportExistValidator
  implements ValidatorConstraintInterface
{
  constructor(
    private readonly inspectionReportService: InspectionReportService,
  ) {}

  async validate(inspectionReportId: string) {
    const inspectionReport =
      await this.inspectionReportService.findFirst(inspectionReportId);
    return !!inspectionReport;
  }

  defaultMessage() {
    return 'Inspection report does not exist';
  }
}

export function IsInspectionReportExist() {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: {},
      constraints: [],
      validator: IsInspectionReportExistValidator,
      async: true,
    });
  };
}
