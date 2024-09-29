import { Test, TestingModule } from '@nestjs/testing';
import { ImportRequestDetailService } from './import-request-detail.service';

describe('ImportRequestDetailService', () => {
  let service: ImportRequestDetailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImportRequestDetailService],
    }).compile();

    service = module.get<ImportRequestDetailService>(ImportRequestDetailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
