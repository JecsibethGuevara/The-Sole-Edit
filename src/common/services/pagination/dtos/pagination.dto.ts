import { IsOptional, IsPositive, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { In } from 'typeorm';

export class PaginationDto {
    @IsOptional()
    @Type(() => Number)
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsPositive()
    limit?: number;

    @IsOptional()
    @Type(() => String)
    @IsString()
    search?: string;

    @IsOptional()
    @IsString()
    category?: string;
}