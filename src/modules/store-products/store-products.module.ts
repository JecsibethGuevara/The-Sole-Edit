import { Module } from '@nestjs/common';
import { StoreProductsService } from './store-products.service';
import { StoreProductsController } from './store-products.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreProduct } from './entities/store-product.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([StoreProduct])],
  controllers: [StoreProductsController],
  providers: [StoreProductsService],
})
export class StoreProductsModule { }
