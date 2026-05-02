import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { QueryProductsDto } from './dto';
export declare class ProductsService {
    private prisma;
    private redis;
    private readonly logger;
    constructor(prisma: PrismaService, redis: RedisService);
    findAll(query: QueryProductsDto): Promise<{
        items: {
            id: any;
            name: any;
            slug: any;
            status: any;
            flowerType: any;
            deliveryAvailable: any;
            featured: any;
            category: any;
            thumbnail: any;
            price: any;
            compareAtPrice: any;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        id: any;
        name: any;
        slug: any;
        description: any;
        status: any;
        flowerType: any;
        occasion: any;
        deliveryAvailable: any;
        featured: any;
        category: any;
        images: any;
        variants: any;
        createdAt: any;
    }>;
    private buildWhereClause;
    private buildOrderBy;
    private formatProductListItem;
    private formatProductDetail;
}
