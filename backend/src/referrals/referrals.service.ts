import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { Response } from 'express';

@Injectable()
export class ReferralsService {
  private readonly logger = new Logger(ReferralsService.name);
  
  constructor(private prisma: PrismaService) {}

  async getMyReferrals(userId: string) {
    let user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { referralCode: true, bonusPoints: true }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Auto-generate code if they don't have one
    if (!user.referralCode) {
      const newCode = uuidv4().replace(/-/g, '').slice(0, 8).toUpperCase();
      user = await this.prisma.user.update({
        where: { id: userId },
        data: { referralCode: newCode },
        select: { referralCode: true, bonusPoints: true }
      });
      this.logger.log(`Generated referral code for user ${userId}: ${newCode}`);
    }

    return user;
  }

  async getInvitedUsers(userId: string) {
    return this.prisma.user.findMany({
      where: { referredById: userId },
      select: { id: true, name: true, createdAt: true }
    });
  }

  async applyCode(userId: string | undefined, code: string, res: Response) {
    const normalizedCode = code.trim().toUpperCase();
    
    // 1. Code exists validation
    const referrer = await this.prisma.user.findUnique({ 
      where: { referralCode: normalizedCode }
    });
    
    if (!referrer) {
      throw new NotFoundException('Invalid referral code');
    }

    if (userId) {
      const currentUser = await this.prisma.user.findUnique({ where: { id: userId }});
      if (!currentUser) throw new NotFoundException('User not found');
      
      // 2. User must not already have referredById (cannot be applied twice)
      if (currentUser.referredById) {
        throw new BadRequestException('You have already applied a referral code.');
      }
      
      // 3. User cannot apply their own code
      if (referrer.id === userId) {
        throw new BadRequestException('You cannot apply your own referral code.');
      }

      await this.prisma.user.update({
        where: { id: userId },
        data: { referredById: referrer.id }
      });
      this.logger.log(`User ${userId} applied referral code ${normalizedCode}`);
    }

    // Always set cookie for persistence across sessions (e.g. for guests who haven't registered yet)
    res.cookie('referral_code', normalizedCode, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return { 
      message: 'Referral code applied successfully', 
      referrerName: referrer.name 
    };
  }
}
