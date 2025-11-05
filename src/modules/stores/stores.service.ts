import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/services/dtos/pagination.dto';
import { PaginationService } from 'src/common/services/pagination.service';

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
      created_by: userId,
      is_active: true
    })

    await this.storeRepository.save(store)
    return store
  }

  //implement pagination and search

  async findAll(pagination: PaginationDto) {
    const skip = (pagination.page || 1 - 1) * (pagination.limit || 25)
    const [stores, total] = await this.storeRepository.findAndCount({
      take: pagination.limit,
      skip: skip,
      //remember: if time allows implement filters
      order: {
        name: 'ASC'
      }
    })

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
