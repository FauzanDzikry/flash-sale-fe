import { api } from './api'

export interface CheckoutRequest {
  product_id: string
  quantity: number
}

export interface CheckoutSuccessResponse {
  message: string
  job_id: string
}

export interface CheckoutListItem {
  id: string
  product_id: string
  product_name: string
  quantity: number
  price: number
  discount: number
  total_price: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface ApiErrorResponse {
  message: string
  error?: string
}

/**
 * List checkouts (order history) for the logged-in user.
 * GET /checkouts — sorted by created_at DESC.
 */
export async function listCheckouts(): Promise<CheckoutListItem[]> {
  const { data } = await api.get<CheckoutListItem[] | { data?: CheckoutListItem[] }>('/checkouts')
  if (Array.isArray(data)) return data
  const inner = (data as { data?: CheckoutListItem[] })?.data
  return Array.isArray(inner) ? inner : []
}

/**
 * Submit checkout (single product).
 * Backend returns 202 Accepted; stock is processed async via Redis worker.
 */
export async function checkout(
  productId: string,
  quantity: number
): Promise<CheckoutSuccessResponse> {
  const { data } = await api.post<CheckoutSuccessResponse>('/checkouts', {
    product_id: productId,
    quantity,
  })
  return data
}
