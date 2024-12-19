import { Test, TestingModule } from '@nestjs/testing';
import { MaterialExportReceiptDetailService } from './material-export-receipt-detail.service';

describe('MaterialExportReceiptDetailService', () => {
  let service: MaterialExportReceiptDetailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MaterialExportReceiptDetailService],
    }).compile();

    service = module.get<MaterialExportReceiptDetailService>(
      MaterialExportReceiptDetailService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
