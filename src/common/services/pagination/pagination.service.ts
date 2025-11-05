import { Injectable } from "@nestjs/common";
import { PaginatedResponse, PaginationMeta } from "./interfaces/pagination.interface";

@Injectable()
export class PaginationService {
    buildPaginationMeta(
        total: number,
        page: number,
        limit: number,
        route: string,
    ): PaginationMeta {
        const totalPages = Math.ceil(total / limit)
        const hasNext = page < totalPages
        const hasPrev = page > 1
        const nextPageUrl = hasNext ? `${process.env.APP_URL}/${route}/${page + 1} ` : ''
        const prevPageUrl = hasPrev ? `${process.env.APP_URL}/${route}/${page - 1} ` : ''

        return {
            page,
            limit,
            total,
            hasNext,
            hasPrev,
            nextPageUrl,
            prevPageUrl
        }
    }

    buildPaginatedResponse<T>(
        data: T[],
        total: number,
        page: number,
        limit: number,
        route: string,
    ): PaginatedResponse<T> {
        return {
            data,
            meta: this.buildPaginationMeta(total, page, limit, route),
        }
    }
}