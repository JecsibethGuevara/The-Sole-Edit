import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { Like, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/services/pagination/dtos/pagination.dto';
import { PaginationService } from 'src/common/services/pagination/pagination.service';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    private paginationService: PaginationService,
  ) { }

  async createStore(createStoreDto: CreateStoreDto, userId: number) {
    const existingStore = await this.storeRepository.findOne({ where: { email: createStoreDto.email } })

    if (existingStore) {
      throw new ConflictException('This email is already in use')
    }

    const store = this.storeRepository.create({
      ...createStoreDto,
      created_by: userId || 0,
      is_active: true
    })

    await this.storeRepository.save(store)
    return store
  }

  async findAll(pagination: PaginationDto) {
    const skip = (pagination.page || 1 - 1) * (pagination.limit || 25)
    const query = this.storeRepository.createQueryBuilder('store');
    query.skip(skip).take(pagination.limit)
    query.orderBy('store.name', 'ASC')

    if (pagination.search) {
      const searchTerm = `%${pagination.search.toLowerCase()}%`;
      query.where('LOWER(store.name) LIKE :search', { search: searchTerm });
    }

    const [stores, total] = await query.getManyAndCount();

    return this.paginationService.buildPaginatedResponse(
      stores,
      total,
      pagination.page || 1,
      pagination.limit || 25,
      'stores',
    )
  }

  async findOne(id: number) {
    const store = await this.storeRepository.findOne({
      where: { id }
    })

    if (!store) {
      throw new NotFoundException(' Store does not exist')
    }

    return store;
  }


  async update(id: number, updateStoreDto: UpdateStoreDto) {
    const store = await this.storeRepository.findOne({
      where: { id }
    })

    if (!store) {
      throw new NotFoundException(' Store does not exist')
    }

    if (updateStoreDto.email && updateStoreDto.email !== store.email) {
      const isEmailUsed = await this.storeRepository.findOne({
        where: { email: updateStoreDto.email }
      })

      if (isEmailUsed) {
        throw new ConflictException('This email is already in use')
      }
    }

    if (updateStoreDto.name && updateStoreDto.name !== store.name) {
      const isNameUsed = await this.storeRepository.findOne({
        where: { name: updateStoreDto.name }
      })

      if (isNameUsed) {
        throw new ConflictException('This name is already in use')
      }
    }

    await this.storeRepository.update(id, {
      ...updateStoreDto
    })

    const updatedStore = await this.storeRepository.findOne({
      where: { id }
    })

    return updatedStore

  }

  async remove(id: number) {
    const store = await this.storeRepository.findOne({ where: { id } })

    if (!store) {
      throw new NotFoundException(' Store does not exist')
    }

    await this.storeRepository.update(id, {
      is_active: false
    })

    const deletedStore = await this.storeRepository.findOne({ where: { id } })
    return deletedStore;
  }
}
