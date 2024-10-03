import { Test, TestingModule } from '@nestjs/testing';
import { MaterialVariantController } from './material-variant.controller';
import { MaterialVariantService } from './material-variant.service';

describe('MaterialVariantController', () => {
  let controller: MaterialVariantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaterialVariantController],
      providers: [MaterialVariantService],
    }).compile();

    controller = module.get<MaterialVariantController>(MaterialVariantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
