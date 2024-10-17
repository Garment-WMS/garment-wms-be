import { Test, TestingModule } from '@nestjs/testing';
import { MaterialReceiptService } from './material-receipt.service';

describe('MaterialReceiptService', () => {
  let service: MaterialReceiptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MaterialReceiptService],
    }).compile();

    service = module.get<MaterialReceiptService>(MaterialReceiptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
