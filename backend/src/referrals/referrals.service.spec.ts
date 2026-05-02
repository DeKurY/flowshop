import { Test, TestingModule } from '@nestjs/testing';
import { ReferralsService } from './referrals.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Response } from 'express';

describe('ReferralsService', () => {
  let service: ReferralsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
  };

  const mockResponse = {
    cookie: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReferralsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ReferralsService>(ReferralsService);
    prisma = module.get<PrismaService>(PrismaService);
    
    jest.clearAllMocks();
  });

  it('should generate a code if user does not have one', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue({ id: '1', referralCode: null, bonusPoints: 0 });
    mockPrismaService.user.update.mockResolvedValue({ referralCode: 'NEWCODE', bonusPoints: 0 });

    const result = await service.getMyReferrals('1');
    expect(result.referralCode).toBe('NEWCODE');
    expect(mockPrismaService.user.update).toHaveBeenCalled();
  });

  it('should apply code successfully for a guest', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue({ id: '2', name: 'Referrer User' });

    const result = await service.applyCode(undefined, 'VALIDCODE', mockResponse);
    expect(result.referrerName).toBe('Referrer User');
    expect(mockResponse.cookie).toHaveBeenCalledWith('referral_code', 'VALIDCODE', expect.any(Object));
  });

  it('should apply code successfully for a logged in user', async () => {
    // 1st call: find referrer
    mockPrismaService.user.findUnique.mockResolvedValueOnce({ id: 'referrer-1', name: 'Referrer User' });
    // 2nd call: find current user
    mockPrismaService.user.findUnique.mockResolvedValueOnce({ id: 'user-1', referredById: null });

    const result = await service.applyCode('user-1', 'VALIDCODE', mockResponse);
    expect(mockPrismaService.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { referredById: 'referrer-1' }
    });
    expect(result.referrerName).toBe('Referrer User');
  });

  it('should throw if applying own code', async () => {
    mockPrismaService.user.findUnique.mockResolvedValueOnce({ id: 'user-1' });
    mockPrismaService.user.findUnique.mockResolvedValueOnce({ id: 'user-1', referredById: null }); // same id

    await expect(service.applyCode('user-1', 'OWNCODE', mockResponse)).rejects.toThrow(BadRequestException);
  });

  it('should throw if already referred', async () => {
    mockPrismaService.user.findUnique.mockResolvedValueOnce({ id: 'referrer-1' });
    mockPrismaService.user.findUnique.mockResolvedValueOnce({ id: 'user-1', referredById: 'someone-else' });

    await expect(service.applyCode('user-1', 'ANYCODE', mockResponse)).rejects.toThrow(BadRequestException);
  });
});
