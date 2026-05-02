export declare class OrderItemDto {
    productId: string;
    variantId: string;
    quantity: number;
    addOnIds?: string[];
}
export declare class CreateOrderDto {
    items: OrderItemDto[];
    recipientName: string;
    recipientPhone: string;
    recipientAddress: string;
    deliveryDate: string;
    deliveryTime: string;
    deliverySlotId?: string;
    isAnonymous?: boolean;
    messageCard?: string;
    notes?: string;
}
