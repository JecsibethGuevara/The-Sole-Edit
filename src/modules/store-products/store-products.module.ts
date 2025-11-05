import { Module } from '@nestjs/common';
import { StoreProductsService } from './store-products.service';
import { StoreProductsController } from './store-products.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreProduct } from './entities/store-product.entity';
import { PaginationService } from 'src/common/services/pagination/pagination.service';
import { PaginationModule } from 'src/common/services/pagination/pagination.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([StoreProduct]), PaginationModule],
  controllers: [StoreProductsController],
  providers: [StoreProductsService, PaginationService],
})
export class StoreProductsModule { }
