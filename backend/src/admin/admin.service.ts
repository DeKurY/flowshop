import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { S3Service } from '../s3/s3.service';
import {
  CreateProductDto,
  UpdateProductDto,
  CreateCategoryDto,
  UpdateCategoryDto,
  UpdateOrderStatusDto,
} from './dto';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private s3: S3Service,
  ) {}

  // ─── Products ───

  async createProduct(dto: CreateProductDto) {
    const slug = this.generateSlug(dto.name);

    const product = await this.prisma.product.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        categoryId: dto.categoryId,
        status: dto.status,
        flowerType: dto.flowerType,
        occasion: dto.occasion ?? [],
        deliveryAvailable: dto.deliveryAvailable ?? true,
        featured: dto.featured ?? false,
        variants: {
          create: dto.variants.map((v) => ({
            size: v.size,
            price: v.price,
            compareAt: v.compareAt,
            sku: v.sku,
            stock: v.stock ?? 0,
            isDefault: v.isDefault ?? false,
          })),
        },
      },
      include: {
        variants: true,
        images: true,
        category: true,
      },
    });

    await this.invalidateProductCache();
    this.logger.log(`Product created: ${product.name} (${product.id})`);
    return product;
  }

  async updateProduct(id: string, dto: UpdateProductDto) {
    const existing = await this.prisma.product.findFirst({
      where: { id, deletedAt: null },
    });

    if (!existing) {
      throw new NotFoundException(`Product ${id} not found`);
    }

    const data: any = { ...dto };
    if (dto.name && dto.name !== existing.name) {
      data.slug = this.generateSlug(dto.name);
    }

    const product = await this.prisma.product.update({
      where: { id },
      data,
      include: { variants: true, images: true, category: true },
    });

    await this.invalidateProductCache();
    return product;
  }

  async deleteProduct(id: string) {
    // Soft delete
    const product = await this.prisma.product.findFirst({
      where: { id, deletedAt: null },
    });

    if (!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }

    await this.prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await this.invalidateProductCache();
    this.logger.log(`Product soft-deleted: ${product.name} (${id})`);
    return { message: 'Product deleted successfully' };
  }

  async uploadProductImage(
    productId: string,
    file: Express.Multer.File,
    sortOrder = 0,
  ) {
    const product = await this.prisma.product.findFirst({
      where: { id: productId, deletedAt: null },
    });

    if (!product) {
      throw new NotFoundException(`Product ${productId} not found`);
    }

    const { url } = await this.s3.upload(file, 'products');

    const image = await this.prisma.productImage.create({
      data: {
        productId,
        url,
        alt: file.originalname,
        sortOrder,
      },
    });

    await this.invalidateProductCache();
    return image;
  }

  // ─── Categories ───

  async createCategory(dto: CreateCategoryDto) {
    const slug = this.generateSlug(dto.name);

    const category = await this.prisma.category.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        imageUrl: dto.imageUrl,
        sortOrder: dto.sortOrder ?? 0,
      },
    });

    await this.redis.delByPattern('categories:*');
    this.logger.log(`Category created: ${category.name} (${category.id})`);
    return category;
  }

  async updateCategory(id: string, dto: UpdateCategoryDto) {
    const existing = await this.prisma.category.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Category ${id} not found`);
    }

    const data: any = { ...dto };
    if (dto.name && dto.name !== existing.name) {
      data.slug = this.generateSlug(dto.name);
    }

    const category = await this.prisma.category.update({
      where: { id },
      data,
    });

    await this.redis.delByPattern('categories:*');
    return category;
  }

  async deleteCategory(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category ${id} not found`);
    }

    await this.prisma.category.delete({ where: { id } });
    await this.redis.delByPattern('categories:*');
    return { message: 'Category deleted successfully' };
  }

  // ─── Orders (Admin) ───

  async getAllOrders(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.order.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: { include: { addOns: true } },
        },
      }),
      this.prisma.order.count(),
    ]);

    return {
      items: items.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        status: o.status,
        totalPrice: Number(o.totalPrice),
        recipientName: o.recipientName,
        deliveryDate: o.deliveryDate,
        deliveryTime: o.deliveryTime,
        customer: o.user,
        itemCount: o.items.length,
        createdAt: o.createdAt,
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async updateOrderStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }

    const updated = await this.prisma.order.update({
      where: { id },
      data: { status: dto.status },
      include: { user: true },
    });

    this.logger.log(
      `Order ${order.orderNumber} status: ${order.status} → ${dto.status}`,
    );

    // Referral Logic: Trigger reward on PAID or DELIVERED, but only on the first order
    const isNowCompleted = dto.status === 'PAID' || dto.status === 'DELIVERED';
    const wasCompleted = order.status === 'PAID' || order.status === 'DELIVERED';

    if (isNowCompleted && !wasCompleted && updated.user?.referredById) {
      // Check if a reward was already given for this referred user
      const existingReward = await this.prisma.referralReward.findFirst({
        where: { referredUserId: updated.user.id },
      });

      if (!existingReward) {
        const REWARD_AMOUNT = 500; // Hardcoded configuration for now

        await this.prisma.$transaction([
          this.prisma.referralReward.create({
            data: {
              rewardAmount: REWARD_AMOUNT,
              userId: updated.user.referredById,
              referredUserId: updated.user.id,
              orderId: updated.id,
            },
          }),
          this.prisma.user.update({
            where: { id: updated.user.referredById },
            data: { bonusPoints: { increment: REWARD_AMOUNT } },
          }),
        ]);

        this.logger.log(
          `Referral reward of ${REWARD_AMOUNT} granted to user ${updated.user.referredById} for order ${updated.id}`,
        );
      }
    }

    return {
      id: updated.id,
      orderNumber: updated.orderNumber,
      status: updated.status,
    };
  }

  // ─── Helpers ───

  private generateSlug(name: string): string {
    const base = name
      .toLowerCase()
      .replace(/[^a-z0-9а-яё\s-]/gi, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    const suffix = Date.now().toString(36).slice(-4);
    return `${base}-${suffix}`;
  }

  private async invalidateProductCache() {
    await this.redis.delByPattern('products:*');
  }
}
