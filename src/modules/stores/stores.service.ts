import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
  ) { }

  async createStore(createStoreDto: CreateStoreDto, userId: number) {
    const existingStore = await this.storeRepository.findOne({ where: { email: createStoreDto.email } })

    if (existingStore) {
      throw new BadRequestException('This email is already in use')
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

  async findAll(page?: number, limit: number = 25) {
    console.log(page)
    const pageReq = page ? page : 1
    const skip = (pageReq - 1) * limit
    console.log(skip)

    const [stores, total] = await this.storeRepository.findAndCount({
      take: limit,
      skip: skip,
      //remember: if time allows implement filters
      order: {
        name: 'ASC'
      }
    })

    return {
      data: stores,
      total: total,
      page: page,
      limit: limit
    }
  }

  findOne(id: number) {
    const store = this.storeRepository.findOne({
      where: { id }
    })

    if (!store) {
      throw new BadRequestException(' Store does not exist')
    }

    return store;
  }


  async update(id: number, updateStoreDto: UpdateStoreDto) {
    const store = await this.storeRepository.findOne({
      where: { id }
    })

    if (!store) {
      throw new BadRequestException(' Store does not exist')
    }

    if (updateStoreDto.email && updateStoreDto.email !== store.email) {
      const isEmailUsed = await this.storeRepository.findOne({
        where: { email: updateStoreDto.email }
      })

      if (isEmailUsed) {
        throw new BadRequestException()
      }
    }

    if (updateStoreDto.name && updateStoreDto.name !== store.name) {
      const isNameUsed = await this.storeRepository.findOne({
        where: { name: updateStoreDto.name }
      })

      if (isNameUsed) {
        throw new BadRequestException()
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
      throw new BadRequestException()
    }

    await this.storeRepository.update(id, {
      is_active: false
    })

    const deletedStore = await this.storeRepository.findOne({ where: { id } })
    return deletedStore;
  }
}
