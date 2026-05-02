import { ProductStatus, FlowerType, Occasion, VariantSize, OrderStatus } from '@prisma/client';
export declare class CreateVariantDto {
    size: VariantSize;
    price: number;
    compareAt?: number;
    sku?: string;
    stock?: number;
    isDefault?: boolean;
}
export declare class CreateProductDto {
    name: string;
    description?: string;
    categoryId?: string;
    status?: ProductStatus;
    flowerType?: FlowerType;
    occasion?: Occasion[];
    deliveryAvailable?: boolean;
    featured?: boolean;
    variants: CreateVariantDto[];
}
export declare class UpdateProductDto {
    name?: string;
    description?: string;
    categoryId?: string;
    status?: ProductStatus;
    flowerType?: FlowerType;
    occasion?: Occasion[];
    deliveryAvailable?: boolean;
    featured?: boolean;
}
export declare class CreateCategoryDto {
    name: string;
    description?: string;
    imageUrl?: string;
    sortOrder?: number;
}
export declare class UpdateCategoryDto {
    name?: string;
    description?: string;
    imageUrl?: string;
    sortOrder?: number;
}
export declare class UpdateOrderStatusDto {
    status: OrderStatus;
}
