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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const redis_service_1 = require("../redis/redis.service");
let CartService = class CartService {
    constructor(prisma, redis) {
        this.prisma = prisma;
        this.redis = redis;
    }
    async getCart(userId) {
        let cart = await this.prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: {
                            select: { id: true, name: true, slug: true, images: { take: 1, orderBy: { sortOrder: 'asc' } } },
                        },
                        variant: {
                            select: { id: true, size: true, price: true },
                        },
                        addOns: {
                            include: {
                                addOn: { select: { id: true, name: true, price: true } },
                            },
                        },
                    },
                },
            },
        });
        if (!cart) {
            cart = await this.prisma.cart.create({
                data: { userId },
                include: {
                    items: {
                        include: {
                            product: {
                                select: { id: true, name: true, slug: true, images: { take: 1, orderBy: { sortOrder: 'asc' } } },
                            },
                            variant: {
                                select: { id: true, size: true, price: true },
                            },
                            addOns: {
                                include: {
                                    addOn: { select: { id: true, name: true, price: true } },
                                },
                            },
                        },
                    },
                },
            });
        }
        return this.formatCart(cart);
    }
    async addItem(userId, dto) {
        const variant = await this.prisma.productVariant.findFirst({
            where: { id: dto.variantId, productId: dto.productId },
        });
        if (!variant) {
            throw new common_1.BadRequestException('Invalid product/variant combination');
        }
        let cart = await this.prisma.cart.findUnique({ where: { userId } });
        if (!cart) {
            cart = await this.prisma.cart.create({ data: { userId } });
        }
        const existingItem = await this.prisma.cartItem.findUnique({
            where: {
                cartId_productId_variantId: {
                    cartId: cart.id,
                    productId: dto.productId,
                    variantId: dto.variantId,
                },
            },
        });
        if (existingItem) {
            await this.prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + (dto.quantity ?? 1) },
            });
        }
        else {
            const cartItem = await this.prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId: dto.productId,
                    variantId: dto.variantId,
                    quantity: dto.quantity ?? 1,
                },
            });
            if (dto.addOns?.length) {
                await this.prisma.cartItemAddOn.createMany({
                    data: dto.addOns.map((a) => ({
                        cartItemId: cartItem.id,
                        addOnId: a.addOnId,
                        quantity: a.quantity ?? 1,
                    })),
                });
            }
        }
        return this.getCart(userId);
    }
    async updateItem(userId, itemId, dto) {
        const item = await this.findCartItem(userId, itemId);
        await this.prisma.cartItem.update({
            where: { id: item.id },
            data: { quantity: dto.quantity },
        });
        return this.getCart(userId);
    }
    async removeItem(userId, itemId) {
        const item = await this.findCartItem(userId, itemId);
        await this.prisma.cartItem.delete({ where: { id: item.id } });
        return this.getCart(userId);
    }
    async clearCart(userId) {
        const cart = await this.prisma.cart.findUnique({ where: { userId } });
        if (cart) {
            await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
        }
        return this.getCart(userId);
    }
    async getGuestCart(sessionId) {
        const cart = await this.redis.getGuestCart(sessionId);
        return cart ?? { items: [], itemCount: 0, subtotal: 0 };
    }
    async addGuestItem(sessionId, dto) {
        const cart = (await this.redis.getGuestCart(sessionId)) ?? { items: [] };
        const variant = await this.prisma.productVariant.findFirst({
            where: { id: dto.variantId, productId: dto.productId },
            include: {
                product: {
                    select: { name: true, slug: true, images: { take: 1, orderBy: { sortOrder: 'asc' } } },
                },
            },
        });
        if (!variant) {
            throw new common_1.BadRequestException('Invalid product/variant combination');
        }
        const existingIdx = cart.items.findIndex((i) => i.productId === dto.productId && i.variantId === dto.variantId);
        if (existingIdx >= 0) {
            cart.items[existingIdx].quantity += dto.quantity ?? 1;
        }
        else {
            cart.items.push({
                id: `guest-${Date.now()}`,
                productId: dto.productId,
                variantId: dto.variantId,
                quantity: dto.quantity ?? 1,
                productName: variant.product.name,
                productSlug: variant.product.slug,
                size: variant.size,
                price: Number(variant.price),
                thumbnail: variant.product.images?.[0]?.url ?? null,
            });
        }
        await this.redis.setGuestCart(sessionId, cart);
        return this.formatGuestCart(cart);
    }
    async clearGuestCart(sessionId) {
        await this.redis.deleteGuestCart(sessionId);
        return { items: [], itemCount: 0, subtotal: 0 };
    }
    async findCartItem(userId, itemId) {
        const cart = await this.prisma.cart.findUnique({ where: { userId } });
        if (!cart)
            throw new common_1.NotFoundException('Cart not found');
        const item = await this.prisma.cartItem.findFirst({
            where: { id: itemId, cartId: cart.id },
        });
        if (!item)
            throw new common_1.NotFoundException('Cart item not found');
        return item;
    }
    formatCart(cart) {
        const items = cart.items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            product: {
                id: item.product.id,
                name: item.product.name,
                slug: item.product.slug,
                thumbnail: item.product.images?.[0]?.url ?? null,
            },
            variant: {
                id: item.variant.id,
                size: item.variant.size,
                price: Number(item.variant.price),
            },
            addOns: item.addOns.map((a) => ({
                id: a.addOn.id,
                name: a.addOn.name,
                price: Number(a.addOn.price),
                quantity: a.quantity,
            })),
            lineTotal: Number(item.variant.price) * item.quantity +
                item.addOns.reduce((sum, a) => sum + Number(a.addOn.price) * a.quantity, 0),
        }));
        return {
            id: cart.id,
            items,
            itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
            subtotal: items.reduce((sum, i) => sum + i.lineTotal, 0),
        };
    }
    formatGuestCart(cart) {
        return {
            items: cart.items,
            itemCount: cart.items.reduce((s, i) => s + i.quantity, 0),
            subtotal: cart.items.reduce((s, i) => s + i.price * i.quantity, 0),
        };
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService])
], CartService);
//# sourceMappingURL=cart.service.js.map