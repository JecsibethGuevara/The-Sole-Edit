import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { AuthModule } from '../auth/auth.module';
import { PaginationService } from 'src/common/services/pagination/pagination.service';
import { PaginationModule } from 'src/common/services/pagination/pagination.module';

@Module({
  imports: [TypeOrmModule.forFeature([Store]), AuthModule, PaginationModule],
  controllers: [StoresController],
  providers: [StoresService, PaginationService],
})
export class StoresModule { }
