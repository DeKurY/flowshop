import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client: Redis;
  private readonly logger = new Logger(RedisService.name);

  constructor(private configService: ConfigService) {
    this.client = new Redis({
      host: this.configService.get<string>('REDIS_HOST', 'localhost'),
      port: this.configService.get<number>('REDIS_PORT', 6379),
      retryStrategy: (times) => Math.min(times * 50, 2000),
    });

    this.client.on('connect', () => this.logger.log('Redis connected'));
    this.client.on('error', (err) => this.logger.error('Redis error', err));
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  // ─── Core operations ───

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.client.set(key, value, 'EX', ttlSeconds);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async delByPattern(pattern: string): Promise<void> {
    const keys = await this.client.keys(pattern);
    if (keys.length > 0) {
      await this.client.del(...keys);
    }
  }

  // ─── Cache-aside helper with namespaced keys ───

  async getOrSet<T>(
    namespace: string,
    key: string,
    fetcher: () => Promise<T>,
    ttlSeconds = 300,
  ): Promise<T> {
    const fullKey = `${namespace}:${key}`;
    const cached = await this.get(fullKey);

    if (cached) {
      this.logger.debug(`Cache HIT: ${fullKey}`);
      return JSON.parse(cached) as T;
    }

    this.logger.debug(`Cache MISS: ${fullKey}`);
    const data = await fetcher();
    await this.set(fullKey, JSON.stringify(data), ttlSeconds);
    return data;
  }

  // ─── Guest cart helpers (Redis-backed guest carts) ───

  async getGuestCart(sessionId: string): Promise<any | null> {
    const data = await this.get(`cart:guest:${sessionId}`);
    return data ? JSON.parse(data) : null;
  }

  async setGuestCart(
    sessionId: string,
    cart: any,
    ttlSeconds = 86400 * 7, // 7 days
  ): Promise<void> {
    await this.set(`cart:guest:${sessionId}`, JSON.stringify(cart), ttlSeconds);
  }

  async deleteGuestCart(sessionId: string): Promise<void> {
    await this.del(`cart:guest:${sessionId}`);
  }
}
