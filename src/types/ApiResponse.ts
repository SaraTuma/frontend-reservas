export interface ApiResponse<T> {
  data: T[];
  message: string;
}

export interface ApiPaginator {
  pageNumber: number;
  totalElements: number;
  totalPages: number;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  nif?: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  price?: number;
}

export interface Reservation {
  id: string;
  clientName: string;
  serviceName: string;
  status: string;
}

