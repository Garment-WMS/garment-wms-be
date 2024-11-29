import { Test, TestingModule } from '@nestjs/testing';
import { ImageService } from '../image/image.service';
import { UserService } from './user.service';
import { PrismaService } from 'prisma/prisma.service';

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            account: {
              findFirst: jest.fn(),
            },
          },
        },
        {
          provide: ImageService,
          useValue: {},
        },
        {
          provide: 'BullQueue_receipt-adjustment',
          useValue: {},
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });
});