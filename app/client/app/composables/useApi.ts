import type { ApiErrorBody } from '~/types/api'

// ошибка api с сообщением от бэкенда, чтобы формы могли показать его пользователю
export class ApiError extends Error {
  statusCode: number

  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
  }
}

const extractMessage = (body: unknown): string => {
  const err = body as ApiErrorBody | undefined
  if (!err?.message) return 'Что-то пошло не так, попробуйте еще раз'
  return Array.isArray(err.message) ? err.message.join(', ') : err.message
}

// обертка над $fetch: подставляет базовый url, jwt-токен и разворачивает ошибки в ApiError
export const useApi = () => {
  const config = useRuntimeConfig()
  const auth = useAuthStore()

  const request = async <T>(path: string, options: Parameters<typeof $fetch>[1] = {}): Promise<T> => {
    try {
      return await $fetch<T>(path, {
        baseURL: config.public.apiBase,
        headers: auth.token ? { Authorization: `Bearer ${auth.token}` } : undefined,
        ...options,
      })
    } catch (error) {
      const fetchError = error as { response?: { status: number; _data?: unknown } }
      if (fetchError.response?.status === 401) auth.forceLogout()
      throw new ApiError(fetchError.response?.status ?? 0, extractMessage(fetchError.response?._data))
    }
  }

  return {
    get: <T>(path: string, query?: Record<string, unknown>) => request<T>(path, { method: 'GET', query }),
    post: <T>(path: string, body?: Record<string, unknown>) => request<T>(path, { method: 'POST', body }),
    patch: <T>(path: string, body?: Record<string, unknown>) => request<T>(path, { method: 'PATCH', body }),
    delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
  }
}
