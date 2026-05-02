import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getCart(userId?: string, sessionId?: string): Promise<any>;
    addItem(dto: AddToCartDto, userId?: string, sessionId?: string): Promise<{
        items: any;
        itemCount: any;
        subtotal: any;
    }>;
    updateItem(itemId: string, dto: UpdateCartItemDto, userId: string): Promise<{
        id: any;
        items: any;
        itemCount: any;
        subtotal: any;
    }>;
    removeItem(itemId: string, userId: string): Promise<{
        id: any;
        items: any;
        itemCount: any;
        subtotal: any;
    }>;
    clearCart(userId?: string, sessionId?: string): Promise<{
        id: any;
        items: any;
        itemCount: any;
        subtotal: any;
    }> | Promise<{
        items: never[];
        itemCount: number;
        subtotal: number;
    }>;
}
