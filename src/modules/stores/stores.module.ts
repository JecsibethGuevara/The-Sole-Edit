import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Store]), AuthModule],
  controllers: [StoresController],
  providers: [StoresService],
})
export class StoresModule { }
