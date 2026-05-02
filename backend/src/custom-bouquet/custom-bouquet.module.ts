import { Module } from '@nestjs/common';
import { CustomBouquetController } from './custom-bouquet.controller';
import { CustomBouquetService } from './custom-bouquet.service';

@Module({
  controllers: [CustomBouquetController],
  providers: [CustomBouquetService]
})
export class CustomBouquetModule {}
