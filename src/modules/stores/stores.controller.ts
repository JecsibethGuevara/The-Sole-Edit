import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Request, UseGuards, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import type { AuthenticatedRequest } from '../auth/interfaces/authenticatedRequest.interface';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';

@Controller('stores')
@UseGuards(JwtAuthGuard)
export class StoresController {
  constructor(private readonly storesService: StoresService) { }

  @Post()
  create(
    @Body() createStoreDto: CreateStoreDto,
    @Request() req) {
    console.log(req.user.userId)
    return this.storesService.createStore(createStoreDto, req.user.userId);
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number
  ) {
    return this.storesService.findAll(page);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storesService.update(+id, updateStoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storesService.remove(+id);
  }
}
