"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ProductsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const redis_service_1 = require("../redis/redis.service");
let ProductsService = ProductsService_1 = class ProductsService {
    constructor(prisma, redis) {
        this.prisma = prisma;
        this.redis = redis;
        this.logger = new common_1.Logger(ProductsService_1.name);
    }
    async findAll(query) {
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
        }, 120);
    }
    async findOne(id) {
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
                throw new common_1.NotFoundException(`Product ${id} not found`);
            }
            return this.formatProductDetail(product);
        }, 300);
    }
    buildWhereClause(query) {
        const where = {
            deletedAt: null,
        };
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
        if (query.minPrice !== undefined || query.maxPrice !== undefined) {
            where.variants = {
                some: {
                    ...(query.minPrice !== undefined && {
                        price: { gte: query.minPrice },
                    }),
                    ...(query.maxPrice !== undefined && {
                        price: { lte: query.maxPrice },
                    }),
                },
            };
        }
        return where;
    }
    buildOrderBy(query) {
        const direction = query.sortOrder ?? 'desc';
        switch (query.sortBy) {
            case 'name':
                return { name: direction };
            case 'price':
                return { createdAt: direction };
            default:
                return { createdAt: direction };
        }
    }
    formatProductListItem(product) {
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
    formatProductDetail(product) {
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
            images: product.images.map((img) => ({
                id: img.id,
                url: img.url,
                alt: img.alt,
                sortOrder: img.sortOrder,
            })),
            variants: product.variants.map((v) => ({
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
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = ProductsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService])
], ProductsService);
//# sourceMappingURL=products.service.js.map