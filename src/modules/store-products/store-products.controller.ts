import { Controller, Request, Get, Post, Body, Patch, Param, Delete, UseGuards, DefaultValuePipe, ParseIntPipe, Query } from '@nestjs/common';
import { StoreProductsService } from './store-products.service';
import { CreateStoreProductDto } from './dto/create-store-product.dto';
import { UpdateStoreProductDto } from './dto/update-store-product.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { PaginationDto } from 'src/common/services/pagination/dtos/pagination.dto';

@Controller('stores')
@UseGuards(JwtAuthGuard)
export class StoreProductsController {
  constructor(private readonly storeProductsService: StoreProductsService) { }

  @Post()
  create(@Body() createStoreProductDto: CreateStoreProductDto) {
    return this.storeProductsService.create(createStoreProductDto);
  }

  @Get(':id/products')
  findAll(
    @Param('id') storeId: number,
    @Pagination() pagination: PaginationDto
  ) {
    return this.storeProductsService.findAll(storeId, pagination);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStoreProductDto: UpdateStoreProductDto) {
    return this.storeProductsService.update(+id, updateStoreProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storeProductsService.remove(+id);
  }
}
