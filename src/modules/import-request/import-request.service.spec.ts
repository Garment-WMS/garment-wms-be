import { Test, TestingModule } from '@nestjs/testing';
import { ImportRequestService } from './import-request.service';

describe('ImportRequestService', () => {
  let service: ImportRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImportRequestService],
    }).compile();

    service = module.get<ImportRequestService>(ImportRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
