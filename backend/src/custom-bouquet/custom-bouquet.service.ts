import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CartService } from '../cart/cart.service';
import { CreateCustomBouquetDto } from './dto';
import { FlowerType } from '@prisma/client';

const FLOWER_PRICES: Record<FlowerType, number> = {
  ROSES: 5.00,
  TULIPS: 3.50,
  PEONIES: 8.00,
  LILIES: 6.00,
  CHRYSANTHEMUMS: 4.00,
  HYDRANGEAS: 7.00,
  ORCHIDS: 12.00,
  SUNFLOWERS: 5.50,
  MIXED: 6.50,
  DRIED: 4.50,
  OTHER: 5.00,
};

@Injectable()
export class CustomBouquetService {
  private readonly logger = new Logger(CustomBouquetService.name);

  constructor(
    private prisma: PrismaService,
    private cartService: CartService,
  ) {}

  async getOptions() {
    const addOns = await this.prisma.addOn.findMany({ where: { available: true } });
    return {
      flowers: FLOWER_PRICES,
      addOns: addOns.map(a => ({
        id: a.id,
        name: a.name,
        price: Number(a.price),
        imageUrl: a.imageUrl,
      })),
    };
  }

  async buildAndAddToCart(
    dto: CreateCustomBouquetDto,
    userId?: string,
    sessionId?: string,
  ) {
    if (!userId && !sessionId) {
      throw new BadRequestException('User or Session ID required to add to cart');
    }

    let flowerCount = 0;
    let addOnCount = 0;
    let totalPrice = 0;

    const addOnIds = dto.items.filter(i => i.addOnId).map(i => i.addOnId as string);
    const dbAddOns = addOnIds.length > 0 
      ? await this.prisma.addOn.findMany({ where: { id: { in: addOnIds } } })
      : [];
    const addOnMap = new Map(dbAddOns.map(a => [a.id, a]));

    const processedItems = dto.items.map(item => {
      let itemPrice = 0;

      if (item.flowerType) {
        flowerCount += item.quantity;
        itemPrice = FLOWER_PRICES[item.flowerType];
      } else if (item.addOnId) {
        addOnCount += item.quantity;
        const addOn = addOnMap.get(item.addOnId);
        if (!addOn) throw new BadRequestException(`Add-on ${item.addOnId} not found`);
        itemPrice = Number(addOn.price);
      } else {
        throw new BadRequestException('Item must specify flowerType or addOnId');
      }

      totalPrice += itemPrice * item.quantity;

      return {
        ...item,
        price: itemPrice,
      };
    });

    // Enforce constraints to prevent malicious payload abuse
    if (flowerCount > 101) throw new BadRequestException('Maximum 101 flowers allowed per bouquet');
    if (addOnCount > 10) throw new BadRequestException('Maximum 10 add-ons allowed per bouquet');
    if (totalPrice > 1000) throw new BadRequestException('Maximum custom bouquet value is $1000');
    if (totalPrice === 0) throw new BadRequestException('Bouquet must contain items');

    const bouquet = await this.prisma.customBouquet.create({
      data: {
        price: totalPrice,
        items: {
          create: processedItems.map(i => ({
            flowerType: i.flowerType,
            addOnId: i.addOnId,
            quantity: i.quantity,
            price: i.price,
          }))
        }
      }
    });

    this.logger.log(`Built custom bouquet ${bouquet.id} for $${totalPrice}`);

    // Add to cart
    if (userId) {
      await this.cartService.addItem(userId, { customBouquetId: bouquet.id, quantity: 1 });
    } else if (sessionId) {
      await this.cartService.addGuestItem(sessionId, { customBouquetId: bouquet.id, quantity: 1 });
    }

    return bouquet;
  }
}
