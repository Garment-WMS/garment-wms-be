import { Test, TestingModule } from '@nestjs/testing';
import { InventoryReportPlanService } from './inventory-report-plan.service';

describe('InventoryReportPlanService', () => {
  let service: InventoryReportPlanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InventoryReportPlanService],
    }).compile();

    service = module.get<InventoryReportPlanService>(InventoryReportPlanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
