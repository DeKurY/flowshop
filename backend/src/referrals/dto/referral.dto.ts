import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ApplyReferralCodeDto {
  @ApiProperty({ description: 'The referral code to apply' })
  @IsString()
  @IsNotEmpty()
  code!: string;
}
