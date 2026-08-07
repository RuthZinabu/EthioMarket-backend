export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  docs: T[];
  page: number;
  totalPages: number;
  limit: number;
  totalDoc: number;
  nextPage: number | null;
  prevPage: number | null;
}

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

/**
 * Standard enterprise-level pagination response formatter
 */
export function formatPaginatedResponse<T>(
  data: { docs: T[]; total: number },
  options: PaginationOptions,
): PaginatedResult<T> {
  const { page, limit } = options;
  const totalDoc = data.total;
  const totalPages = Math.ceil(totalDoc / limit);

  return {
    docs: data.docs,
    page,
    totalPages,
    limit,
    totalDoc,
    prevPage: page > 1 ? page - 1 : null,
    nextPage: page < totalPages ? page + 1 : null,
  };
}

type PaginationQuery = {
  page?: string | number;
  limit?: string | number;
};

export const getPagination = (query: PaginationQuery) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
};
