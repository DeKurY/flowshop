export declare class AddOnDto {
    addOnId: string;
    quantity?: number;
}
export declare class AddToCartDto {
    productId: string;
    variantId: string;
    quantity?: number;
    addOns?: AddOnDto[];
}
export declare class UpdateCartItemDto {
    quantity: number;
}
