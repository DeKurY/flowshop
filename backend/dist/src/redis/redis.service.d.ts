import { OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class RedisService implements OnModuleDestroy {
    private configService;
    private readonly client;
    private readonly logger;
    constructor(configService: ConfigService);
    onModuleDestroy(): Promise<void>;
    get(key: string): Promise<string | null>;
    set(key: string, value: string, ttlSeconds?: number): Promise<void>;
    del(key: string): Promise<void>;
    delByPattern(pattern: string): Promise<void>;
    getOrSet<T>(namespace: string, key: string, fetcher: () => Promise<T>, ttlSeconds?: number): Promise<T>;
    getGuestCart(sessionId: string): Promise<any | null>;
    setGuestCart(sessionId: string, cart: any, ttlSeconds?: number): Promise<void>;
    deleteGuestCart(sessionId: string): Promise<void>;
}
