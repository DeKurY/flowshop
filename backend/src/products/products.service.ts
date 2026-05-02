import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { QueryProductsDto } from './dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  /**
   * List products with filtering, search, and pagination.
   * Results are cached in Redis with namespaced keys.
   */
  async findAll(query: QueryProductsDto) {
    const cacheKey = JSON.stringify(query);

    return this.redis.getOrSet('products:list', cacheKey, async () => {
      const where = this.buildWhereClause(query);
      const orderBy = this.buildOrderBy(query);
      const page = query.page ?? 1;
      const limit = query.limit ?? 12;
      const skip = (page - 1) * limit;

      const [items, total] = await Promise.all([
        this.prisma.product.findMany({
          where,
          orderBy,
          skip,
          take: limit,
          include: {
            category: { select: { id: true, name: true, slug: true } },
            images: { orderBy: { sortOrder: 'asc' }, take: 1 },
            variants: {
              where: { isDefault: true },
              take: 1,
            },
          },
        }),
        this.prisma.product.count({ where }),
      ]);

      return {
        items: items.map((p) => this.formatProductListItem(p)),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }, 120); // Cache for 2 minutes
  }

  /**
   * Get a single product by ID with all relations.
   */
  async findOne(id: string) {
    return this.redis.getOrSet('products:detail', id, async () => {
      const product = await this.prisma.product.findFirst({
        where: { id, deletedAt: null },
        include: {
          category: true,
          images: { orderBy: { sortOrder: 'asc' } },
          variants: { orderBy: { size: 'asc' } },
        },
      });

      if (!product) {
        throw new NotFoundException(`Product ${id} not found`);
      }

      return this.formatProductDetail(product);
    }, 300); // Cache for 5 minutes
  }

  // ─── Private helpers ───

  private buildWhereClause(query: QueryProductsDto): Prisma.ProductWhereInput {
    const where: Prisma.ProductWhereInput = {
      deletedAt: null, // Soft delete filter
    };

    // Full-text search on name and description
    if (query.q) {
      where.OR = [
        { name: { contains: query.q, mode: 'insensitive' } },
        { description: { contains: query.q, mode: 'insensitive' } },
      ];
    }

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    if (query.category) {
      where.category = { slug: query.category };
    }

    if (query.flowerType) {
      where.flowerType = query.flowerType;
    }

    if (query.occasion) {
      where.occasion = { has: query.occasion };
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.deliveryAvailable !== undefined) {
      where.deliveryAvailable = query.deliveryAvailable;
    }

    if (query.featured !== undefined) {
      where.featured = query.featured;
    }

    // Price range filter — uses variants
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.variants = {
        some: {
          price: {
            ...(query.minPrice !== undefined && { gte: query.minPrice }),
            ...(query.maxPrice !== undefined && { lte: query.maxPrice }),
          },
        },
      };
    }

    return where;
  }

  private buildOrderBy(
    query: QueryProductsDto,
  ): Prisma.ProductOrderByWithRelationInput {
    const direction = query.sortOrder ?? 'desc';

    switch (query.sortBy) {
      case 'name':
        return { name: direction };
      case 'price':
        // Sort by default variant price — fallback to createdAt
        return { createdAt: direction };
      default:
        return { createdAt: direction };
    }
  }

  private formatProductListItem(product: any) {
    const defaultVariant = product.variants?.[0];
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      status: product.status,
      flowerType: product.flowerType,
      deliveryAvailable: product.deliveryAvailable,
      featured: product.featured,
      category: product.category,
      thumbnail: product.images?.[0]?.url ?? null,
      price: defaultVariant?.price ?? null,
      compareAtPrice: defaultVariant?.compareAt ?? null,
    };
  }

  private formatProductDetail(product: any) {
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      status: product.status,
      flowerType: product.flowerType,
      occasion: product.occasion,
      deliveryAvailable: product.deliveryAvailable,
      featured: product.featured,
      category: product.category,
      images: product.images.map((img: any) => ({
        id: img.id,
        url: img.url,
        alt: img.alt,
        sortOrder: img.sortOrder,
      })),
      variants: product.variants.map((v: any) => ({
        id: v.id,
        size: v.size,
        price: v.price,
        compareAt: v.compareAt,
        sku: v.sku,
        stock: v.stock,
        isDefault: v.isDefault,
      })),
      createdAt: product.createdAt,
    };
  }
}
