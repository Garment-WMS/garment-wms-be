import { Test, TestingModule } from '@nestjs/testing';
import { MaterialExportReceiptService } from './material-export-receipt.service';

describe('MaterialExportReceiptService', () => {
  let service: MaterialExportReceiptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MaterialExportReceiptService],
    }).compile();

    service = module.get<MaterialExportReceiptService>(MaterialExportReceiptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
