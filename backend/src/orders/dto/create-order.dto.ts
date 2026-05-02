import {
  IsString,
  IsBoolean,
  IsOptional,
  IsInt,
  IsDateString,
  IsArray,
  ValidateNested,
  Min,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderItemDto {
  @ApiProperty()
  @IsString()
  productId!: string;

  @ApiProperty()
  @IsString()
  variantId!: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  quantity!: number;

  @ApiPropertyOptional({ description: 'Add-on IDs to include' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  addOnIds?: string[];
}

export class CreateOrderDto {
  @ApiProperty({ description: 'Order items', type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];

  // ─── Delivery info ───

  @ApiProperty({ description: 'Recipient full name' })
  @IsString()
  recipientName!: string;

  @ApiProperty({ description: 'Recipient phone in format +7XXXXXXXXXX' })
  @IsString()
  @Matches(/^\+?[0-9]{10,15}$/, {
    message: 'Phone must be a valid number (10-15 digits, optional + prefix)',
  })
  recipientPhone!: string;

  @ApiProperty({ description: 'Delivery address' })
  @IsString()
  recipientAddress!: string;

  @ApiProperty({
    description: 'Delivery date (ISO 8601, must not be in the past)',
    example: '2026-03-15',
  })
  @IsDateString()
  deliveryDate!: string;

  @ApiProperty({
    description: 'Delivery time window',
    example: '10:00-12:00',
  })
  @IsString()
  deliveryTime!: string;

  @ApiPropertyOptional({ description: 'Delivery slot ID for capacity tracking' })
  @IsOptional()
  @IsString()
  deliverySlotId?: string;

  // ─── Options ───

  @ApiPropertyOptional({ description: 'Anonymous delivery (hide sender info)', default: false })
  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;

  @ApiPropertyOptional({ description: 'Message card text' })
  @IsOptional()
  @IsString()
  messageCard?: string;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}
