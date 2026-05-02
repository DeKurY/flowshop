import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async findAll() {
    return this.redis.getOrSet('categories', 'all', async () => {
      const categories = await this.prisma.category.findMany({
        orderBy: { sortOrder: 'asc' },
        include: {
          _count: { select: { products: true } },
        },
      });

      return categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        imageUrl: c.imageUrl,
        sortOrder: c.sortOrder,
        productCount: c._count.products,
      }));
    }, 600); // Cache 10 min
  }

  async findOne(id: string) {
    return this.redis.getOrSet('categories', id, async () => {
      const category = await this.prisma.category.findUnique({
        where: { id },
        include: { _count: { select: { products: true } } },
      });

      if (!category) return null;

      return {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        imageUrl: category.imageUrl,
        productCount: category._count.products,
      };
    }, 600);
  }

  async findBySlug(slug: string) {
    return this.redis.getOrSet('categories:slug', slug, async () => {
      const category = await this.prisma.category.findUnique({
        where: { slug },
        include: { _count: { select: { products: true } } },
      });

      if (!category) return null;

      return {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        imageUrl: category.imageUrl,
        productCount: category._count.products,
      };
    }, 600);
  }
}
