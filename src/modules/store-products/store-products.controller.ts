import { Controller, Request, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { StoreProductsService } from './store-products.service';
import { CreateStoreProductDto } from './dto/create-store-product.dto';
import { UpdateStoreProductDto } from './dto/update-store-product.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';

@Controller('store-products')
@UseGuards(JwtAuthGuard)
export class StoreProductsController {
  constructor(private readonly storeProductsService: StoreProductsService) { }

  @Post()
  create(@Body() createStoreProductDto: CreateStoreProductDto,
    @Request() req) {
    return this.storeProductsService.create(createStoreProductDto, req.user.userId);
  }

  @Get()
  findAll() {
    return this.storeProductsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storeProductsService.findOne(+id);
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
