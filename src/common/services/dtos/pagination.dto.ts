import { IsOptional, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { In } from 'typeorm';

export class PaginationDto {
    @IsOptional()
    @Type(() => Number)
    @IsPositive()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsPositive()
    @Min(1)
    limit?: number;


    @IsOptional()
    @Type(() => Number)
    @IsPositive()
    @Min(1)
    count?: number;


    @IsOptional()
    @Type(() => Boolean)
    hasNext: boolean;

    @IsOptional()
    @Type(() => Boolean)
    hasPrev: boolean;

    @IsOptional()
    @Type(() => String)
    nextPageUrl: string;

    @IsOptional()
    @Type(() => String)
    prevPageUrl: string;



}