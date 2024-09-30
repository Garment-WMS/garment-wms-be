import { Test, TestingModule } from '@nestjs/testing';
import { PackagingUnitController } from './packaging-unit.controller';
import { PackagingUnitService } from './packaging-unit.service';

describe('PackagingUnitController', () => {
  let controller: PackagingUnitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PackagingUnitController],
      providers: [PackagingUnitService],
    }).compile();

    controller = module.get<PackagingUnitController>(PackagingUnitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
