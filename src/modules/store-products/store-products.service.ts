import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateStoreProductDto } from './dto/update-store-product.dto';
import { CreateStoreProductDto } from './dto/create-store-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreProduct } from './entities/store-product.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/services/pagination/dtos/pagination.dto';
import { PaginationService } from 'src/common/services/pagination/pagination.service';

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
      throw new ConflictException()
    }

    const isAvailable = createStoreProductDto.stock > 0

    const storeProduct = this.storeProdsRepository.create({
      store: { id: createStoreProductDto.store_id },
      product: { id: createStoreProductDto.product_id },
      price: createStoreProductDto.price,
      stock: createStoreProductDto.stock,
      is_available: isAvailable,
    })


    await this.storeProdsRepository.save(storeProduct)
    return storeProduct
  }

  async findAll(storeId: number, pagination: PaginationDto) {
    const page = pagination.page || 1
    const limit = pagination.limit || 25
    const skip = (page - 1) * limit
    const query = this.storeProdsRepository.createQueryBuilder('storeProduct');
    query.innerJoinAndSelect('storeProduct.product', 'product');
    query.where('storeProduct.store.id = :storeId', { storeId });

    if (pagination.category) {
      query.andWhere('LOWER(product.category) LIKE :category', {
        category: `%${pagination.category.toLowerCase()}%`
      });
    }

    query.orderBy('storeProduct.createdAt', 'DESC');
    query.skip(skip);
    query.take(limit);

    const [products, total] = await query.getManyAndCount();

    return this.paginationService.buildPaginatedResponse(
      products,
      total,
      page,
      limit,
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
      throw new NotFoundException()
    }

    if (updateStoreProductDto.store_id || updateStoreProductDto.product_id) {
      throw new BadRequestException
    }

    const updatePayload = { ...updateStoreProductDto }

    if (updateStoreProductDto.stock !== undefined) {
      updatePayload.is_available = updateStoreProductDto.stock > 0;
    }

    await this.storeProdsRepository.update(id, {
      ...updatePayload
    })

    const updatedStoreProducts = await this.storeProdsRepository.findOne({ where: { id } })
    return updatedStoreProducts
  }


  async remove(id: number) {
    const store = await this.storeProdsRepository.findOne({ where: { id } })

    if (!store) {
      throw new NotFoundException()
    }

    await this.storeProdsRepository.update(id, {
      is_available: false
    })

    const deletedStoreProduct = await this.storeProdsRepository.findOne({ where: { id } })
    return deletedStoreProduct
  }
}
