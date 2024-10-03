import { Test, TestingModule } from '@nestjs/testing';
import { MaterialVariantService } from './material-variant.service';

describe('MaterialVariantService', () => {
  let service: MaterialVariantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MaterialVariantService],
    }).compile();

    service = module.get<MaterialVariantService>(MaterialVariantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
