import { Test, TestingModule } from '@nestjs/testing';
import { MaterialExportRequestDetailService } from './material-export-request-detail.service';

describe('MaterialExportRequestDetailService', () => {
  let service: MaterialExportRequestDetailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MaterialExportRequestDetailService],
    }).compile();

    service = module.get<MaterialExportRequestDetailService>(MaterialExportRequestDetailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
