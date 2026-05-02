import { IsString, IsEnum, IsInt, IsOptional, IsArray, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FlowerType } from '@prisma/client';

export class CustomBouquetItemDto {
  @ApiPropertyOptional({ enum: FlowerType })
  @IsOptional()
  @IsEnum(FlowerType)
  flowerType?: FlowerType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  addOnId?: string;

  @ApiProperty({ description: 'Quantity of this flower or add-on' })
  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CreateCustomBouquetDto {
  @ApiProperty({ type: [CustomBouquetItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CustomBouquetItemDto)
  items!: CustomBouquetItemDto[];
}
