import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PaginationDto } from '../services/pagination/dtos/pagination.dto';


export const Pagination = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): PaginationDto => {
        const request = ctx.switchToHttp().getRequest();
        const { page = 0, limit = 10, search, category } = request.query;

        const pagination = new PaginationDto();
        pagination.page = parseInt(page, 10);
        pagination.limit = parseInt(limit, 10);

        if (search) {
            pagination.search = search as string;
        }
        if (category) {
            pagination.category = category as string;
        }

        return pagination;
    },
);