import { api } from './api'

/** Payload for create product (BE expects created_by). */
export interface CreateProductPayload {
  name: string
  category: string
  stock: number
  price: number
  discount: number
  created_by: string
}

/** Payload for update product (no created_by). */
export interface UpdateProductPayload {
  name: string
  category: string
  stock: number
  price: number
  discount: number
}

/** Product from BE response (API contract). */
export interface ProductResponse {
  id: string
  name: string
  category: string
  stock: number
  price: number
  discount: number
  created_by?: string
  [key: string]: unknown
}

export const productsApi = {
  /**
   * List products owned by user (GetAllByUser).
   * GET /api/v1/products — only products for the JWT user.
   * Backend excludes soft-deleted (deleted_at NOT NULL).
   */
  async list(): Promise<ProductResponse[]> {
    const { data } = await api.get<ProductResponse[] | { data?: ProductResponse[] | null }>('/products')
    if (Array.isArray(data)) return data
    const inner = (data as { data?: ProductResponse[] | null })?.data
    return Array.isArray(inner) ? inner : []
  },

  /**
   * List all products (GetAll).
   * GET /api/v1/products/all — for marketplace/home.
   * Backend excludes soft-deleted (deleted_at NOT NULL).
   */
  async getAll(): Promise<ProductResponse[]> {
    const { data } = await api.get<ProductResponse[] | { data?: ProductResponse[] | null }>('/products/all')
    if (Array.isArray(data)) return data
    const inner = (data as { data?: ProductResponse[] | null })?.data
    return Array.isArray(inner) ? inner : []
  },

  /** Get one product by ID (owned by logged-in user only). */
  async getById(id: string): Promise<ProductResponse> {
    const { data } = await api.get<ProductResponse | { data: ProductResponse }>(`/products/${id}`)
    return (data as { data?: ProductResponse }).data ?? (data as ProductResponse)
  },

  /** Create product. */
  async create(payload: CreateProductPayload): Promise<ProductResponse> {
    const { data } = await api.post<ProductResponse | { data: ProductResponse }>('/products', payload)
    return (data as { data?: ProductResponse }).data ?? (data as ProductResponse)
  },

  /** Update product. */
  async update(id: string, payload: UpdateProductPayload): Promise<ProductResponse> {
    const { data } = await api.put<ProductResponse | { data: ProductResponse }>(`/products/${id}`, payload)
    return (data as { data?: ProductResponse }).data ?? (data as ProductResponse)
  },

  /** Delete product. */
  async delete(id: string): Promise<void> {
    await api.delete(`/products/${id}`)
  },
}
