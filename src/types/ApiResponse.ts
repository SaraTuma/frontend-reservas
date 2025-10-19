export interface ApiResponse<T> {
  data: T[];
  message: string;
}

export interface ApiPaginator {
  pageNumber: number;
  totalElements: number;
  totalPages: number;
}

