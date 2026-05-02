import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
export declare class CategoriesService {
    private prisma;
    private redis;
    constructor(prisma: PrismaService, redis: RedisService);
    findAll(): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        imageUrl: string | null;
        sortOrder: number;
        productCount: number;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        imageUrl: string | null;
        productCount: number;
    } | null>;
    findBySlug(slug: string): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        imageUrl: string | null;
        productCount: number;
    } | null>;
}
