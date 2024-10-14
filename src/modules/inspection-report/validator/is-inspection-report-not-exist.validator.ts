import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { InspectionReportService } from '../inspection-report.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsInspectionReportNotExistValidator
  implements ValidatorConstraintInterface
{
  constructor(
    private readonly inspectionReportService: InspectionReportService,
  ) {}

  async validate(inspectionReportId: string) {
    const inspectionReport =
      await this.inspectionReportService.findFirst(inspectionReportId);
    return !inspectionReport;
  }

  defaultMessage() {
    return 'Inspection report already exist';
  }
}

export function IsInspectionReportNotExist() {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: {},
      constraints: [],
      validator: IsInspectionReportNotExistValidator,
      async: true,
    });
  };
}
