import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PaginationDto } from '../services/dtos/pagination.dto';


export const Pagination = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): PaginationDto => {
        const request = ctx.switchToHttp().getRequest();
        const { page = 1, limit = 10 } = request.query;

        const pagination = new PaginationDto();
        pagination.page = parseInt(page, 10);
        pagination.limit = parseInt(limit, 10);

        return pagination;
    },
);