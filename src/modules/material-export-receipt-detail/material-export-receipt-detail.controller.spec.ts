import { Test, TestingModule } from '@nestjs/testing';
import { MaterialExportReceiptDetailController } from './material-export-receipt-detail.controller';
import { MaterialExportReceiptDetailService } from './material-export-receipt-detail.service';

describe('MaterialExportReceiptDetailController', () => {
  let controller: MaterialExportReceiptDetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaterialExportReceiptDetailController],
      providers: [MaterialExportReceiptDetailService],
    }).compile();

    controller = module.get<MaterialExportReceiptDetailController>(MaterialExportReceiptDetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
