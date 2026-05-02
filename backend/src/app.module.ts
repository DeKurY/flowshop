import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

// Core modules
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { S3Module } from './s3/s3.module';

// Feature modules
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { AdminModule } from './admin/admin.module';
import { SessionMiddleware } from './common/middleware/session.middleware';
import { ReferralsModule } from './referrals/referrals.module';
import { PromotionsModule } from './promotions/promotions.module';
import { CustomBouquetModule } from './custom-bouquet/custom-bouquet.module';

@Module({
  imports: [
    // Configuration — loads .env automatically
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Rate limiting — 100 requests per 60 seconds
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),

    // Core infrastructure
    PrismaModule,
    RedisModule,
    S3Module,

    // Feature modules
    ProductsModule,
    CategoriesModule,
    CartModule,
    OrdersModule,
    AdminModule,
    ReferralsModule,
    PromotionsModule,
    CustomBouquetModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionMiddleware).forRoutes('*');
  }
}
