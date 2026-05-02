import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { AddToCartDto, UpdateCartItemDto } from './dto';
export declare class CartService {
    private prisma;
    private redis;
    constructor(prisma: PrismaService, redis: RedisService);
    getCart(userId: string): Promise<{
        id: any;
        items: any;
        itemCount: any;
        subtotal: any;
    }>;
    addItem(userId: string, dto: AddToCartDto): Promise<{
        id: any;
        items: any;
        itemCount: any;
        subtotal: any;
    }>;
    updateItem(userId: string, itemId: string, dto: UpdateCartItemDto): Promise<{
        id: any;
        items: any;
        itemCount: any;
        subtotal: any;
    }>;
    removeItem(userId: string, itemId: string): Promise<{
        id: any;
        items: any;
        itemCount: any;
        subtotal: any;
    }>;
    clearCart(userId: string): Promise<{
        id: any;
        items: any;
        itemCount: any;
        subtotal: any;
    }>;
    getGuestCart(sessionId: string): Promise<any>;
    addGuestItem(sessionId: string, dto: AddToCartDto): Promise<{
        items: any;
        itemCount: any;
        subtotal: any;
    }>;
    clearGuestCart(sessionId: string): Promise<{
        items: never[];
        itemCount: number;
        subtotal: number;
    }>;
    private findCartItem;
    private formatCart;
    private formatGuestCart;
}
