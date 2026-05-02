import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePromotionDto, UpdatePromotionDto } from './dto';

@Injectable()
export class PromotionsService {
  private readonly logger = new Logger(PromotionsService.name);

  constructor(private prisma: PrismaService) {}

  async findAll(onlyActive = true) {
    const where: any = {};
    
    if (onlyActive) {
      where.isActive = true;
      where.deletedAt = null;
      where.validUntil = { gt: new Date() };
    }
    
    const promotions = await this.prisma.promotion.findMany({
      where,
      include: {
        products: { select: { productId: true } },
        categories: { select: { categoryId: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return promotions.map(p => ({
      ...p,
      productIds: p.products.map(pp => pp.productId),
      categoryIds: p.categories.map(pc => pc.categoryId),
      products: undefined,
      categories: undefined,
    }));
  }

  async create(dto: CreatePromotionDto) {
    const exists = await this.prisma.promotion.findUnique({ where: { code: dto.code }});
    if (exists) throw new BadRequestException(`Promotion code ${dto.code} already exists`);

    const promotion = await this.prisma.promotion.create({
      data: {
        code: dto.code,
        discountType: dto.discountType,
        discountValue: dto.discountValue,
        validFrom: new Date(dto.validFrom),
        validUntil: new Date(dto.validUntil),
        targetType: dto.targetType,
        usageLimit: dto.usageLimit,
        perUserLimit: dto.perUserLimit,
        isActive: dto.isActive ?? true,
        products: dto.productIds?.length ? {
          create: dto.productIds.map(id => ({ productId: id }))
        } : undefined,
        categories: dto.categoryIds?.length ? {
          create: dto.categoryIds.map(id => ({ categoryId: id }))
        } : undefined,
      },
      include: { products: true, categories: true }
    });

    this.logger.log(`Promotion created: ${promotion.code}`);
    return promotion;
  }

  async update(id: string, dto: UpdatePromotionDto) {
    const promotion = await this.prisma.promotion.findUnique({ where: { id }});
    if (!promotion) throw new NotFoundException('Promotion not found');

    const data: any = { ...dto };
    delete data.productIds;
    delete data.categoryIds;

    if (dto.validFrom) data.validFrom = new Date(dto.validFrom);
    if (dto.validUntil) data.validUntil = new Date(dto.validUntil);

    return this.prisma.$transaction(async (tx) => {
      // Update basic fields
      await tx.promotion.update({
        where: { id },
        data,
      });

      // Update products relation
      if (dto.productIds !== undefined) {
        await tx.promotionProduct.deleteMany({ where: { promotionId: id } });
        if (dto.productIds.length > 0) {
          await tx.promotionProduct.createMany({
            data: dto.productIds.map(pid => ({ promotionId: id, productId: pid }))
          });
        }
      }

      // Update categories relation
      if (dto.categoryIds !== undefined) {
        await tx.promotionCategory.deleteMany({ where: { promotionId: id } });
        if (dto.categoryIds.length > 0) {
          await tx.promotionCategory.createMany({
            data: dto.categoryIds.map(cid => ({ promotionId: id, categoryId: cid }))
          });
        }
      }

      const updated = await tx.promotion.findUnique({ 
        where: { id }, 
        include: { products: true, categories: true }
      });
      return updated;
    });
  }

  async remove(id: string) {
    const promotion = await this.prisma.promotion.findUnique({ where: { id }});
    if (!promotion) throw new NotFoundException('Promotion not found');

    await this.prisma.promotion.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false }
    });
    
    this.logger.log(`Promotion soft deleted: ${id}`);
    return { message: 'Promotion deleted successfully' };
  }
}
