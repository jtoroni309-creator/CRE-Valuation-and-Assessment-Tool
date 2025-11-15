/**
 * Pagination utilities
 */

import { Pagination, PaginationParams } from '../types';

/**
 * Calculate pagination metadata
 */
export function calculatePagination(
  params: PaginationParams,
  totalCount: number
): Pagination {
  const page = params.page || 1;
  const limit = Math.min(params.limit || 20, 100); // Max 100 items per page

  const totalPages = Math.ceil(totalCount / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return {
    page,
    limit,
    total: totalCount,
    totalPages,
    hasNext,
    hasPrev,
  };
}

/**
 * Calculate SQL offset for pagination
 */
export function getOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}

/**
 * Create pagination links for API responses
 */
export function createPaginationLinks(
  baseUrl: string,
  pagination: Pagination
): {
  first: string;
  last: string;
  next?: string;
  prev?: string;
} {
  const { page, limit, totalPages, hasNext, hasPrev } = pagination;

  const buildUrl = (p: number) => `${baseUrl}?page=${p}&limit=${limit}`;

  return {
    first: buildUrl(1),
    last: buildUrl(totalPages),
    ...(hasNext && { next: buildUrl(page + 1) }),
    ...(hasPrev && { prev: buildUrl(page - 1) }),
  };
}
