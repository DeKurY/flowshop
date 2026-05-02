import { Test, TestingModule } from '@nestjs/testing';
import { PromotionsService } from './promotions.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { DiscountType, PromotionTarget } from '@prisma/client';

describe('PromotionsService', () => {
  let service: PromotionsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    promotion: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PromotionsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PromotionsService>(PromotionsService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should find all active promotions for public', async () => {
    mockPrismaService.promotion.findMany.mockResolvedValue([
      { id: '1', products: [], categories: [] }
    ]);
    const result = await service.findAll(true);
    expect(result).toHaveLength(1);
    expect(mockPrismaService.promotion.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ isActive: true, deletedAt: null })
      })
    );
  });

  it('should create a new promotion', async () => {
    mockPrismaService.promotion.findUnique.mockResolvedValue(null);
    mockPrismaService.promotion.create.mockResolvedValue({ id: 'promo1', code: 'NEWYEAR' });

    const dto = {
      code: 'NEWYEAR', discountType: DiscountType.PERCENTAGE, discountValue: 20,
      validFrom: '2025-01-01', validUntil: '2025-12-31', targetType: PromotionTarget.ORDER
    };
    
    const result = await service.create(dto);
    expect(result.code).toBe('NEWYEAR');
  });

  it('should throw BadRequest if promotion code already exists', async () => {
    mockPrismaService.promotion.findUnique.mockResolvedValue({ id: 'existing' });

    const dto = {
      code: 'ALREADY_EXISTS', discountType: DiscountType.PERCENTAGE, discountValue: 20,
      validFrom: '2025-01-01', validUntil: '2025-12-31', targetType: PromotionTarget.ORDER
    };
    
    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
  });

  it('should soft delete a promotion', async () => {
    mockPrismaService.promotion.findUnique.mockResolvedValue({ id: '1' });
    mockPrismaService.promotion.update.mockResolvedValue({ id: '1', isActive: false });

    await service.remove('1');
    expect(mockPrismaService.promotion.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ isActive: false }) })
    );
  });
});
