import type { ParsedUrlQuery } from 'querystring'

export interface QParams extends ParsedUrlQuery {
    id?: string;
    search?: string;
}