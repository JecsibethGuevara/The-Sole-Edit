import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateStoreProductDto } from './dto/update-store-product.dto';
import { CreateStoreProductDto } from './dto/create-store-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreProduct } from './entities/store-product.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/services/dtos/pagination.dto';
import { PaginationService } from 'src/common/services/pagination.service';
import { ProductsModule } from '../products/products.module';

@Injectable()
export class StoreProductsService {
  constructor(
    @InjectRepository(StoreProduct)
    private storeProdsRepository: Repository<StoreProduct>,
    private paginationService: PaginationService,

  ) { }

  async create(createStoreProductDto: CreateStoreProductDto) {
    const existingRelationShip = await this.storeProdsRepository.findOne({
      where: {
        store: { id: createStoreProductDto.store_id },
        product: { id: createStoreProductDto.product_id }
      }
    })

    console.log(createStoreProductDto)

    if (existingRelationShip) {
      console.log(existingRelationShip)
      throw new BadRequestException()
    }

    const storeProduct = this.storeProdsRepository.create({
      store: { id: createStoreProductDto.store_id },
      product: { id: createStoreProductDto.product_id },
      price: createStoreProductDto.price,
      stock: createStoreProductDto.stock,
      is_available: createStoreProductDto.is_available,
    })


    await this.storeProdsRepository.save(storeProduct)
    return storeProduct
  }

  async findAll(storeId: number, pagination: PaginationDto) {
    const skip = (pagination.page || 1 - 1) * (pagination.limit || 25)
    const [products, total] = await this.storeProdsRepository.findAndCount({
      take: pagination.limit,
      skip: skip,
      order: {
        createdAt: 'DESC'
      }
    })

    return this.paginationService.buildPaginatedResponse(
      products,
      total,
      pagination.page || 1,
      pagination.page || 25,
      `store-products/${storeId}/products`
    )
  }

  async update(id: number, updateStoreProductDto: UpdateStoreProductDto) {
    const storeProduct = await this.storeProdsRepository.findOne({
      where: {
        id
      }
    })

    if (!storeProduct) {
      throw new BadRequestException()
    }

    if (updateStoreProductDto.store_id || updateStoreProductDto.product_id) {
      throw new BadRequestException
    }

    await this.storeProdsRepository.update(id, {
      ...updateStoreProductDto
    })

    const updatedStoreProducts = await this.storeProdsRepository.findOne({ where: { id } })
    return updatedStoreProducts
  }


  async remove(id: number) {
    const store = await this.storeProdsRepository.findOne({ where: { id } })

    if (!store) {
      throw new BadRequestException()
    }

    await this.storeProdsRepository.update(id, {
      is_available: false
    })

    const deletedStoreProduct = await this.storeProdsRepository.findOne({ where: { id } })
    return deletedStoreProduct
  }
}
