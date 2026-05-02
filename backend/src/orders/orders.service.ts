import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Create a new order with items, delivery info, and options.
   */
  async create(userId: string, dto: CreateOrderDto) {
    // Validate delivery date is not in the past
    const deliveryDate = new Date(dto.deliveryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (deliveryDate < today) {
      throw new BadRequestException('Delivery date cannot be in the past');
    }

    // Validate delivery slot availability if provided
    if (dto.deliverySlotId) {
      const slot = await this.prisma.deliverySlot.findUnique({
        where: { id: dto.deliverySlotId },
      });

      if (!slot || !slot.available || slot.currentOrders >= slot.maxOrders) {
        throw new BadRequestException(
          'Selected delivery slot is not available or fully booked',
        );
      }
    }

    // Fetch all variants and compute prices
    const variantIds = dto.items.map((i) => i.variantId);
    const variants = await this.prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      include: { product: { select: { id: true, name: true } } },
    });

    const variantMap = new Map(variants.map((v) => [v.id, v]));

    // Fetch add-on data
    const allAddOnIds = dto.items.flatMap((i) => i.addOnIds ?? []);
    const addOns =
      allAddOnIds.length > 0
        ? await this.prisma.addOn.findMany({
            where: { id: { in: allAddOnIds } },
          })
        : [];
    const addOnMap = new Map(addOns.map((a) => [a.id, a]));

    // Build order items and calculate subtotal
    let subtotal = 0;
    const orderItemsData = dto.items.map((item) => {
      const variant = variantMap.get(item.variantId);
      if (!variant) {
        throw new BadRequestException(
          `Variant ${item.variantId} not found`,
        );
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

    // Add add-on prices to subtotal
    for (const item of orderItemsData) {
      for (const addOnId of item.addOnIds) {
        const addOn = addOnMap.get(addOnId);
        if (addOn) {
          subtotal += Number(addOn.price);
        }
      }
    }

    const deliveryFee = 0; // Can be calculated based on address
    const totalPrice = subtotal + deliveryFee;
    const orderNumber = this.generateOrderNumber();

    // Create order in a transaction
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
                    if (!addOn) return null;
                    return {
                      addOnId,
                      priceAtPurchase: addOn.price,
                      addOnName: addOn.name,
                    };
                  })
                  .filter(Boolean) as any[],
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

      // Increment delivery slot counter
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

  /**
   * List orders for a user.
   */
  async findAllByUser(userId: string) {
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

  /**
   * Get a single order by ID.
   */
  async findOne(id: string, userId?: string) {
    const where: any = { id };
    if (userId) where.userId = userId;

    const order = await this.prisma.order.findFirst({
      where,
      include: {
        items: {
          include: { addOns: true },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }

    return this.formatOrder(order);
  }

  // ─── Helpers ───

  private generateOrderNumber(): string {
    const now = new Date();
    const datePart = now.toISOString().slice(2, 10).replace(/-/g, '');
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `PB-${datePart}-${randomPart}`;
  }

  private formatOrder(order: any) {
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
      items: order.items.map((item: any) => ({
        id: item.id,
        productName: item.productName,
        variantSize: item.variantSize,
        quantity: item.quantity,
        priceAtPurchase: Number(item.priceAtPurchase),
        addOns: item.addOns.map((a: any) => ({
          name: a.addOnName,
          price: Number(a.priceAtPurchase),
        })),
      })),
      createdAt: order.createdAt,
    };
  }
}
