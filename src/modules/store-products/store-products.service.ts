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
    try {
      const existingRelationShip = await this.storeProdsRepository.findOne({
        where: {
          store: { id: createStoreProductDto.store_id },
          product: { id: createStoreProductDto.product_id }
        }
      })


      if (existingRelationShip) {
        throw new ConflictException('This product is already associated with the store')
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
    catch (error) {
      throw new BadRequestException('Failed to create store product')

    }
  }

  async findAll(storeId: number, pagination: PaginationDto) {
    const page = pagination.page || 1
    const limit = pagination.limit || 25
    const skip = (page - 1) * limit
    const query = this.storeProdsRepository.createQueryBuilder('storeProduct');
    query.innerJoinAndSelect('storeProduct.product', 'product');
    query.where('storeProduct.store.id = :storeId', { storeId });

    console.log('Received inStock:', pagination.inStock, 'type:', typeof pagination.inStock);
    console.log('All pagination params:', pagination);

    if (pagination.category) {
      query.andWhere('LOWER(product.category) LIKE :category', {
        category: `%${pagination.category.toLowerCase()}%`
      });
    }

    if (pagination.search) {
      const searchTerm = `%${pagination.search.toLowerCase()}%`;
      query.andWhere('LOWER(product.name) LIKE :search', { search: searchTerm });
    }

    if (pagination.inStock) {
      const inStockValue = pagination.inStock === 'true';
      query.andWhere('storeProduct.is_available = :inStock', {
        inStock: inStockValue
      });
    }
    query.orderBy('storeProduct.createdAt', 'DESC');
    query.skip(skip);
    query.take(limit);


    const [products, total] = await query.getManyAndCount();

    return this.paginationService.buildPaginatedResponse(
      this.formatJointProducts(products),
      total,
      page,
      limit,
      `store-products/${storeId}/products`
    )
  }

  async update(idStore: number, idProduct: number, updateStoreProductDto: UpdateStoreProductDto) {
    const storeProduct = await this.storeProdsRepository.findOne({
      where: {
        store: { id: idStore },
        product: { id: idProduct }
      }

    })
    const id = storeProduct?.id


    if (!storeProduct) {
      throw new NotFoundException('No such product')
    }

    if (updateStoreProductDto.store_id || updateStoreProductDto.product_id) {
      throw new BadRequestException('Do not modify the relation ship')
    }

    const updatePayload = { ...updateStoreProductDto }

    if (updateStoreProductDto.stock !== undefined) {
      updatePayload.is_available = updateStoreProductDto.stock > 0;
    }

    await this.storeProdsRepository.update(storeProduct.id, {
      ...updatePayload
    })

    const updatedStoreProducts = await this.storeProdsRepository.findOne({ where: { id } })
    return updatedStoreProducts
  }

  async remove(idStore: number, idProduct: number,) {
    const store = await this.storeProdsRepository.findOne({
      where: {
        store: { id: idStore },
        product: { id: idProduct }
      }
    })

    const id = store?.id

    if (!store) {
      throw new NotFoundException()
    }

    await this.storeProdsRepository.update(store?.id, {
      is_available: false,
      stock: 0

    })

    const deletedStoreProduct = await this.storeProdsRepository.findOne({ where: { id } })
    return deletedStoreProduct
  }

  formatJointProducts = (results: StoreProduct[]) => {
    return results.map(item => {
      const { product, ...storeProductData } = item;

      return {
        ...product,
        ...storeProductData,
        store_product_id: storeProductData.id,
        product_id: product.id,
      };
    });
  }
}
