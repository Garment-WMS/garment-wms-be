import { Test, TestingModule } from '@nestjs/testing';
import { InventoryReportDetailController } from './inventory-report-detail.controller';
import { InventoryReportDetailService } from './inventory-report-detail.service';

describe('InventoryReportDetailController', () => {
  let controller: InventoryReportDetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryReportDetailController],
      providers: [InventoryReportDetailService],
    }).compile();

    controller = module.get<InventoryReportDetailController>(InventoryReportDetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
