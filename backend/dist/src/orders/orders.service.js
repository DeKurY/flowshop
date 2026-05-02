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
var OrdersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let OrdersService = OrdersService_1 = class OrdersService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(OrdersService_1.name);
    }
    async create(userId, dto) {
        const deliveryDate = new Date(dto.deliveryDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (deliveryDate < today) {
            throw new common_1.BadRequestException('Delivery date cannot be in the past');
        }
        if (dto.deliverySlotId) {
            const slot = await this.prisma.deliverySlot.findUnique({
                where: { id: dto.deliverySlotId },
            });
            if (!slot || !slot.available || slot.currentOrders >= slot.maxOrders) {
                throw new common_1.BadRequestException('Selected delivery slot is not available or fully booked');
            }
        }
        const variantIds = dto.items.map((i) => i.variantId);
        const variants = await this.prisma.productVariant.findMany({
            where: { id: { in: variantIds } },
            include: { product: { select: { id: true, name: true } } },
        });
        const variantMap = new Map(variants.map((v) => [v.id, v]));
        const allAddOnIds = dto.items.flatMap((i) => i.addOnIds ?? []);
        const addOns = allAddOnIds.length > 0
            ? await this.prisma.addOn.findMany({
                where: { id: { in: allAddOnIds } },
            })
            : [];
        const addOnMap = new Map(addOns.map((a) => [a.id, a]));
        let subtotal = 0;
        const orderItemsData = dto.items.map((item) => {
            const variant = variantMap.get(item.variantId);
            if (!variant) {
                throw new common_1.BadRequestException(`Variant ${item.variantId} not found`);
            }
            const linePrice = Number(variant.price) * item.quantity;
            subtotal += linePrice;
            return {
                productId: item.productId,
                variantId: item.variantId,
                quantity: item.quantity,
                priceAtPurchase: Number(variant.price),
                productName: variant.product.name,
                variantSize: variant.size,
                addOnIds: item.addOnIds ?? [],
            };
        });
        for (const item of orderItemsData) {
            for (const addOnId of item.addOnIds) {
                const addOn = addOnMap.get(addOnId);
                if (addOn) {
                    subtotal += Number(addOn.price);
                }
            }
        }
        const deliveryFee = 0;
        const totalPrice = subtotal + deliveryFee;
        const orderNumber = this.generateOrderNumber();
        const order = await this.prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    orderNumber,
                    userId,
                    subtotal,
                    deliveryFee,
                    totalPrice,
                    recipientName: dto.recipientName,
                    recipientPhone: dto.recipientPhone,
                    recipientAddress: dto.recipientAddress,
                    deliveryDate,
                    deliveryTime: dto.deliveryTime,
                    deliverySlotId: dto.deliverySlotId,
                    isAnonymous: dto.isAnonymous ?? false,
                    messageCard: dto.messageCard,
                    notes: dto.notes,
                    items: {
                        create: orderItemsData.map((item) => ({
                            productId: item.productId,
                            variantId: item.variantId,
                            quantity: item.quantity,
                            priceAtPurchase: item.priceAtPurchase,
                            productName: item.productName,
                            variantSize: item.variantSize,
                            addOns: {
                                create: item.addOnIds
                                    .map((addOnId) => {
                                    const addOn = addOnMap.get(addOnId);
                                    if (!addOn)
                                        return null;
                                    return {
                                        addOnId,
                                        priceAtPurchase: addOn.price,
                                        addOnName: addOn.name,
                                    };
                                })
                                    .filter(Boolean),
                            },
                        })),
                    },
                },
                include: {
                    items: {
                        include: { addOns: true },
                    },
                },
            });
            if (dto.deliverySlotId) {
                await tx.deliverySlot.update({
                    where: { id: dto.deliverySlotId },
                    data: { currentOrders: { increment: 1 } },
                });
            }
            return newOrder;
        });
        this.logger.log(`Order created: ${order.orderNumber}`);
        return this.formatOrder(order);
    }
    async findAllByUser(userId) {
        const orders = await this.prisma.order.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                items: {
                    include: { addOns: true },
                },
            },
        });
        return orders.map((o) => this.formatOrder(o));
    }
    async findOne(id, userId) {
        const where = { id };
        if (userId)
            where.userId = userId;
        const order = await this.prisma.order.findFirst({
            where,
            include: {
                items: {
                    include: { addOns: true },
                },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order ${id} not found`);
        }
        return this.formatOrder(order);
    }
    generateOrderNumber() {
        const now = new Date();
        const datePart = now.toISOString().slice(2, 10).replace(/-/g, '');
        const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `PB-${datePart}-${randomPart}`;
    }
    formatOrder(order) {
        return {
            id: order.id,
            orderNumber: order.orderNumber,
            status: order.status,
            subtotal: Number(order.subtotal),
            deliveryFee: Number(order.deliveryFee),
            totalPrice: Number(order.totalPrice),
            recipientName: order.recipientName,
            recipientPhone: order.recipientPhone,
            recipientAddress: order.recipientAddress,
            deliveryDate: order.deliveryDate,
            deliveryTime: order.deliveryTime,
            isAnonymous: order.isAnonymous,
            messageCard: order.messageCard,
            notes: order.notes,
            items: order.items.map((item) => ({
                id: item.id,
                productName: item.productName,
                variantSize: item.variantSize,
                quantity: item.quantity,
                priceAtPurchase: Number(item.priceAtPurchase),
                addOns: item.addOns.map((a) => ({
                    name: a.addOnName,
                    price: Number(a.priceAtPurchase),
                })),
            })),
            createdAt: order.createdAt,
        };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = OrdersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map