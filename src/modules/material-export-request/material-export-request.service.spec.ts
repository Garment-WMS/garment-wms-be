import { Test, TestingModule } from '@nestjs/testing';
import { MaterialExportRequestService } from './material-export-request.service';

describe('MaterialExportRequestService', () => {
  let service: MaterialExportRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MaterialExportRequestService],
    }).compile();

    service = module.get<MaterialExportRequestService>(MaterialExportRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
