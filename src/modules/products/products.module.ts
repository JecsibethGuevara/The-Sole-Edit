import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginationService } from 'src/common/services/pagination/pagination.service';
import { PaginationModule } from 'src/common/services/pagination/pagination.module';
import { BlacklistService } from '../auth/blacklist.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), AuthModule, PaginationModule],
  controllers: [ProductsController],
  providers: [ProductsService, PaginationService, BlacklistService],
})
export class ProductsModule { }
