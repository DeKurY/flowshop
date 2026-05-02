import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { Response } from 'express';
import { ReferralsService } from './referrals.service';
import { ApplyReferralCodeDto } from './dto';

@ApiTags('Referrals')
@Controller('referrals')
export class ReferralsController {
  constructor(private readonly referralsService: ReferralsService) {}

  @Get('my')
  @ApiOperation({ summary: 'Get my referral code and bonus points' })
  @ApiHeader({ name: 'x-user-id', required: true })
  async getMyReferrals(@Headers('x-user-id') userId?: string) {
    if (!userId) throw new UnauthorizedException('x-user-id header required');
    return this.referralsService.getMyReferrals(userId);
  }

  @Get('invited')
  @ApiOperation({ summary: 'Get list of users invited by me' })
  @ApiHeader({ name: 'x-user-id', required: true })
  async getInvitedUsers(@Headers('x-user-id') userId?: string) {
    if (!userId) throw new UnauthorizedException('x-user-id header required');
    return this.referralsService.getInvitedUsers(userId);
  }

  @Post('apply-code')
  @ApiOperation({ summary: 'Apply a referral code' })
  @ApiHeader({ name: 'x-user-id', required: false, description: 'Optional for guests' })
  async applyCode(
    @Body() dto: ApplyReferralCodeDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('x-user-id') userId?: string,
  ) {
    return this.referralsService.applyCode(userId, dto.code, res);
  }
}
