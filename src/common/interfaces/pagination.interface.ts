export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
    nextPageUrl: string;
    prevPageUrl: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}