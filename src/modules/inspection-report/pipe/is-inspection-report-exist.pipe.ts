import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { InspectionReportService } from '../inspection-report.service';

@Injectable()
export class IsInspectionReportExistPipe implements PipeTransform {
  constructor(
    private readonly InspectionReportService: InspectionReportService,
  ) {}
  async transform(value: string) {
    const isInspectionReportExist =
      !!(await this.InspectionReportService.findFirst(value));

    if (!isInspectionReportExist) {
      throw new BadRequestException('Inspection report is not exist');
    }
    return value;
  }
}
