import { Injectable } from '@nestjs/common';
import { CreateInspectionReportDto } from './dto/create-inspection-report.dto';
import { UpdateInspectionReportDto } from './dto/update-inspection-report.dto';

@Injectable()
export class InspectionReportService {
  create(createInspectionReportDto: CreateInspectionReportDto) {
    return 'This action adds a new inspectionReport';
  }

  findAll() {
    return `This action returns all inspectionReport`;
  }

  findOne(id: number) {
    return `This action returns a #${id} inspectionReport`;
  }

  update(id: number, updateInspectionReportDto: UpdateInspectionReportDto) {
    return `This action updates a #${id} inspectionReport`;
  }

  remove(id: number) {
    return `This action removes a #${id} inspectionReport`;
  }
}
