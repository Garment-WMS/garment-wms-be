import { Test, TestingModule } from '@nestjs/testing';
import { InventoryReportPlanDetailService } from './inventory-report-plan-detail.service';

describe('InventoryReportPlanDetailService', () => {
  let service: InventoryReportPlanDetailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InventoryReportPlanDetailService],
    }).compile();

    service = module.get<InventoryReportPlanDetailService>(InventoryReportPlanDetailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
