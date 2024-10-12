import { Test, TestingModule } from '@nestjs/testing';
import { InspectionReportController } from './inspection-report.controller';
import { InspectionReportService } from './inspection-report.service';

describe('InspectionReportController', () => {
  let controller: InspectionReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InspectionReportController],
      providers: [InspectionReportService],
    }).compile();

    controller = module.get<InspectionReportController>(InspectionReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
