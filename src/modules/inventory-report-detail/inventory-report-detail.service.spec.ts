import { Test, TestingModule } from '@nestjs/testing';
import { InventoryReportDetailService } from './inventory-report-detail.service';

describe('InventoryReportDetailService', () => {
  let service: InventoryReportDetailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InventoryReportDetailService],
    }).compile();

    service = module.get<InventoryReportDetailService>(InventoryReportDetailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
