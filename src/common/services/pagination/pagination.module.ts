import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginationService } from 'src/common/services/pagination/pagination.service';

@Module({
    imports: [],
    controllers: [],
    providers: [PaginationService],
    exports: [PaginationService]
})
export class PaginationModule { }
