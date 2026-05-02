import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { AddToCartDto, UpdateCartItemDto } from './dto';

@Injectable()
export class CartService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  // ─── Authenticated user cart (PostgreSQL) ───

  async getCart(userId: string) {
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
              customBouquet: {
                select: { id: true, price: true, items: true },
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

  async addItem(userId: string, dto: AddToCartDto) {
    if (!dto.customBouquetId && (!dto.productId || !dto.variantId)) {
      throw new BadRequestException('Either customBouquetId or productId/variantId is required');
    }

    if (dto.productId && dto.variantId) {
      const variant = await this.prisma.productVariant.findFirst({
        where: { id: dto.variantId, productId: dto.productId },
      });
      if (!variant) throw new BadRequestException('Invalid product/variant combination');
    }

    if (dto.customBouquetId) {
      const bouquet = await this.prisma.customBouquet.findUnique({
        where: { id: dto.customBouquetId }
      });
      if (!bouquet) throw new BadRequestException('Invalid custom bouquet');
    }

    let cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await this.prisma.cart.create({ data: { userId } });
    }

    // Try to find an existing identical cart item
    let existingItem = null;
    if (dto.productId && dto.variantId) {
       existingItem = await this.prisma.cartItem.findFirst({
         where: { cartId: cart.id, productId: dto.productId, variantId: dto.variantId },
       });
    }

    if (existingItem) {
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + (dto.quantity ?? 1) },
      });
    } else {
      const cartItem = await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: dto.productId,
          variantId: dto.variantId,
          customBouquetId: dto.customBouquetId,
          quantity: dto.quantity ?? 1,
        },
      });

      if (dto.addOns?.length && !dto.customBouquetId) { // assuming bouquets come pre-bundled with add-ons if any
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

  async updateItem(userId: string, itemId: string, dto: UpdateCartItemDto) {
    const item = await this.findCartItem(userId, itemId);
    await this.prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity: dto.quantity },
    });
    return this.getCart(userId);
  }

  async removeItem(userId: string, itemId: string) {
    const item = await this.findCartItem(userId, itemId);
    await this.prisma.cartItem.delete({ where: { id: item.id } });
    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (cart) {
      await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
    return this.getCart(userId);
  }

  // ─── Guest cart (Redis) ───

  async getGuestCart(sessionId: string) {
    const cart = await this.redis.getGuestCart(sessionId);
    return cart ?? { items: [], itemCount: 0, subtotal: 0 };
  }

  async addGuestItem(sessionId: string, dto: AddToCartDto) {
    if (!dto.customBouquetId && (!dto.productId || !dto.variantId)) {
      throw new BadRequestException('Either customBouquetId or productId/variantId is required');
    }

    const cart = (await this.redis.getGuestCart(sessionId)) ?? { items: [] };

    if (dto.customBouquetId) {
      const bouquet = await this.prisma.customBouquet.findUnique({
        where: { id: dto.customBouquetId },
      });
      if (!bouquet) throw new BadRequestException('Invalid custom bouquet');

      const existingIdx = cart.items.findIndex((i: any) => i.customBouquetId === dto.customBouquetId);
      if (existingIdx >= 0) {
        cart.items[existingIdx].quantity += dto.quantity ?? 1;
      } else {
        cart.items.push({
          id: `guest-bouquet-${Date.now()}`,
          customBouquetId: bouquet.id,
          quantity: dto.quantity ?? 1,
          productName: 'Custom Bouquet',
          price: Number(bouquet.price),
        });
      }
    } else if (dto.productId && dto.variantId) {
      const variant = await this.prisma.productVariant.findFirst({
        where: { id: dto.variantId, productId: dto.productId },
        include: {
          product: { select: { name: true, slug: true, images: { take: 1, orderBy: { sortOrder: 'asc' } } } },
        },
      });

      if (!variant) throw new BadRequestException('Invalid product/variant combination');

      const existingIdx = cart.items.findIndex(
        (i: any) => i.productId === dto.productId && i.variantId === dto.variantId,
      );

      if (existingIdx >= 0) {
        cart.items[existingIdx].quantity += dto.quantity ?? 1;
      } else {
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
    }

    await this.redis.setGuestCart(sessionId, cart);
    return this.formatGuestCart(cart);
  }

  async clearGuestCart(sessionId: string) {
    await this.redis.deleteGuestCart(sessionId);
    return { items: [], itemCount: 0, subtotal: 0 };
  }

  // ─── Helpers ───

  private async findCartItem(userId: string, itemId: string) {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new NotFoundException('Cart not found');

    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    });
    if (!item) throw new NotFoundException('Cart item not found');
    return item;
  }

  private formatCart(cart: any) {
    const items = cart.items.map((item: any) => ({
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
      addOns: item.addOns.map((a: any) => ({
        id: a.addOn.id,
        name: a.addOn.name,
        price: Number(a.addOn.price),
        quantity: a.quantity,
      })),
      lineTotal:
        Number(item.variant.price) * item.quantity +
        item.addOns.reduce(
          (sum: number, a: any) => sum + Number(a.addOn.price) * a.quantity,
          0,
        ),
    }));

    return {
      id: cart.id,
      items,
      itemCount: items.reduce((sum: number, i: any) => sum + i.quantity, 0),
      subtotal: items.reduce((sum: number, i: any) => sum + i.lineTotal, 0),
    };
  }

  private formatGuestCart(cart: any) {
    return {
      items: cart.items,
      itemCount: cart.items.reduce((s: number, i: any) => s + i.quantity, 0),
      subtotal: cart.items.reduce(
        (s: number, i: any) => s + i.price * i.quantity,
        0,
      ),
    };
  }
}
