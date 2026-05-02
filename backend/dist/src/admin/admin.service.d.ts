import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { S3Service } from '../s3/s3.service';
import { CreateProductDto, UpdateProductDto, CreateCategoryDto, UpdateCategoryDto, UpdateOrderStatusDto } from './dto';
export declare class AdminService {
    private prisma;
    private redis;
    private s3;
    private readonly logger;
    constructor(prisma: PrismaService, redis: RedisService, s3: S3Service);
    createProduct(dto: CreateProductDto): Promise<{
        category: {
            name: string;
            description: string | null;
            createdAt: Date;
            sortOrder: number;
            id: string;
            slug: string;
            updatedAt: Date;
            imageUrl: string | null;
        } | null;
        variants: {
            price: import("@prisma/client-runtime-utils").Decimal;
            id: string;
            isDefault: boolean;
            size: import(".prisma/client").$Enums.VariantSize;
            compareAt: import("@prisma/client-runtime-utils").Decimal | null;
            sku: string | null;
            stock: number;
            productId: string;
        }[];
        images: {
            url: string;
            sortOrder: number;
            id: string;
            productId: string;
            alt: string | null;
        }[];
    } & {
        name: string;
        description: string | null;
        categoryId: string | null;
        flowerType: import(".prisma/client").$Enums.FlowerType;
        occasion: import(".prisma/client").$Enums.Occasion[];
        status: import(".prisma/client").$Enums.ProductStatus;
        deliveryAvailable: boolean;
        featured: boolean;
        createdAt: Date;
        id: string;
        slug: string;
        deletedAt: Date | null;
        updatedAt: Date;
    }>;
    updateProduct(id: string, dto: UpdateProductDto): Promise<{
        category: {
            name: string;
            description: string | null;
            createdAt: Date;
            sortOrder: number;
            id: string;
            slug: string;
            updatedAt: Date;
            imageUrl: string | null;
        } | null;
        variants: {
            price: import("@prisma/client-runtime-utils").Decimal;
            id: string;
            isDefault: boolean;
            size: import(".prisma/client").$Enums.VariantSize;
            compareAt: import("@prisma/client-runtime-utils").Decimal | null;
            sku: string | null;
            stock: number;
            productId: string;
        }[];
        images: {
            url: string;
            sortOrder: number;
            id: string;
            productId: string;
            alt: string | null;
        }[];
    } & {
        name: string;
        description: string | null;
        categoryId: string | null;
        flowerType: import(".prisma/client").$Enums.FlowerType;
        occasion: import(".prisma/client").$Enums.Occasion[];
        status: import(".prisma/client").$Enums.ProductStatus;
        deliveryAvailable: boolean;
        featured: boolean;
        createdAt: Date;
        id: string;
        slug: string;
        deletedAt: Date | null;
        updatedAt: Date;
    }>;
    deleteProduct(id: string): Promise<{
        message: string;
    }>;
    uploadProductImage(productId: string, file: Express.Multer.File, sortOrder?: number): Promise<{
        url: string;
        sortOrder: number;
        id: string;
        productId: string;
        alt: string | null;
    }>;
    createCategory(dto: CreateCategoryDto): Promise<{
        name: string;
        description: string | null;
        createdAt: Date;
        sortOrder: number;
        id: string;
        slug: string;
        updatedAt: Date;
        imageUrl: string | null;
    }>;
    updateCategory(id: string, dto: UpdateCategoryDto): Promise<{
        name: string;
        description: string | null;
        createdAt: Date;
        sortOrder: number;
        id: string;
        slug: string;
        updatedAt: Date;
        imageUrl: string | null;
    }>;
    deleteCategory(id: string): Promise<{
        message: string;
    }>;
    getAllOrders(page?: number, limit?: number): Promise<{
        items: {
            id: string;
            orderNumber: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            totalPrice: number;
            recipientName: string;
            deliveryDate: Date;
            deliveryTime: string;
            customer: {
                name: string;
                id: string;
                email: string;
            };
            itemCount: number;
            createdAt: Date;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    updateOrderStatus(id: string, dto: UpdateOrderStatusDto): Promise<{
        id: string;
        orderNumber: string;
        status: import(".prisma/client").$Enums.OrderStatus;
    }>;
    private generateSlug;
    private invalidateProductCache;
}
