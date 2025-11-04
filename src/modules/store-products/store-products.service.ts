import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateStoreProductDto } from './dto/update-store-product.dto';
import { CreateStoreProductDto } from './dto/create-store-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreProduct } from './entities/store-product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StoreProductsService {
  constructor(
    @InjectRepository(StoreProduct)
    private storeProdsRepository: Repository<StoreProduct>
  ) { }

  async create(createStoreProductDto: CreateStoreProductDto, userId: number) {
    const existingRelationShip = await this.storeProdsRepository.findOne({
      where: {
        store: createStoreProductDto.store_id,
        product: createStoreProductDto.product_id
      }
    })

    if (existingRelationShip) {
      throw new BadRequestException()
    }

    const storeProduct = await this.storeProdsRepository.create({
      store: createStoreProductDto.store_id,
      product: createStoreProductDto.product_id,
      price: createStoreProductDto.price,
      stock: createStoreProductDto.stock,
      is_available: createStoreProductDto.is_available,
    })


    await this.storeProdsRepository.save(storeProduct)
    return storeProduct
  }

  findAll() {
    return `This action returns all storeProducts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} storeProduct`;
  }

  update(id: number, updateStoreProductDto: UpdateStoreProductDto) {
    return `This action updates a #${id} storeProduct`;
  }

  remove(id: number) {
    return `This action removes a #${id} storeProduct`;
  }
}
