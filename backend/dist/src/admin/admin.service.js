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
var AdminService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const redis_service_1 = require("../redis/redis.service");
const s3_service_1 = require("../s3/s3.service");
let AdminService = AdminService_1 = class AdminService {
    constructor(prisma, redis, s3) {
        this.prisma = prisma;
        this.redis = redis;
        this.s3 = s3;
        this.logger = new common_1.Logger(AdminService_1.name);
    }
    async createProduct(dto) {
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
    async updateProduct(id, dto) {
        const existing = await this.prisma.product.findFirst({
            where: { id, deletedAt: null },
        });
        if (!existing) {
            throw new common_1.NotFoundException(`Product ${id} not found`);
        }
        const data = { ...dto };
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
    async deleteProduct(id) {
        const product = await this.prisma.product.findFirst({
            where: { id, deletedAt: null },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product ${id} not found`);
        }
        await this.prisma.product.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
        await this.invalidateProductCache();
        this.logger.log(`Product soft-deleted: ${product.name} (${id})`);
        return { message: 'Product deleted successfully' };
    }
    async uploadProductImage(productId, file, sortOrder = 0) {
        const product = await this.prisma.product.findFirst({
            where: { id: productId, deletedAt: null },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product ${productId} not found`);
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
    async createCategory(dto) {
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
    async updateCategory(id, dto) {
        const existing = await this.prisma.category.findUnique({ where: { id } });
        if (!existing) {
            throw new common_1.NotFoundException(`Category ${id} not found`);
        }
        const data = { ...dto };
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
    async deleteCategory(id) {
        const category = await this.prisma.category.findUnique({ where: { id } });
        if (!category) {
            throw new common_1.NotFoundException(`Category ${id} not found`);
        }
        await this.prisma.category.delete({ where: { id } });
        await this.redis.delByPattern('categories:*');
        return { message: 'Category deleted successfully' };
    }
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
    async updateOrderStatus(id, dto) {
        const order = await this.prisma.order.findUnique({ where: { id } });
        if (!order) {
            throw new common_1.NotFoundException(`Order ${id} not found`);
        }
        const updated = await this.prisma.order.update({
            where: { id },
            data: { status: dto.status },
        });
        this.logger.log(`Order ${order.orderNumber} status: ${order.status} → ${dto.status}`);
        return {
            id: updated.id,
            orderNumber: updated.orderNumber,
            status: updated.status,
        };
    }
    generateSlug(name) {
        const base = name
            .toLowerCase()
            .replace(/[^a-z0-9а-яё\s-]/gi, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
        const suffix = Date.now().toString(36).slice(-4);
        return `${base}-${suffix}`;
    }
    async invalidateProductCache() {
        await this.redis.delByPattern('products:*');
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = AdminService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService,
        s3_service_1.S3Service])
], AdminService);
//# sourceMappingURL=admin.service.js.map