import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ) { }

  async create(createProductDto: CreateProductDto, userId: number) {
    const producto = this.productRepository.create({
      ...createProductDto,
      store_id: +createProductDto.store_id,
      is_active: true,
      created_by: userId
    })
    await this.productRepository.save(producto)
    return producto
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id }
    })
    if (!product) {
      throw new BadRequestException('No product found')
    }
    return product;
  }


  // remember: implment if time allows
  // update(id: number, updateProductDto: UpdateProductDto) {
  //   return `This action updates a #${id} product`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} product`;
  // }
}
