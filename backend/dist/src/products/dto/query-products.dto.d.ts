import { FlowerType, Occasion, ProductStatus } from '@prisma/client';
export declare class QueryProductsDto {
    q?: string;
    categoryId?: string;
    category?: string;
    flowerType?: FlowerType;
    occasion?: Occasion;
    status?: ProductStatus;
    minPrice?: number;
    maxPrice?: number;
    deliveryAvailable?: boolean;
    featured?: boolean;
    sortBy?: 'price' | 'name' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}
