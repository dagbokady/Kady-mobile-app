import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

const ACCESS_KEY = 'kady.access'
const REFRESH_KEY = 'kady.refresh'

export function loadTokens() {
  return {
    access: localStorage.getItem(ACCESS_KEY),
    refresh: localStorage.getItem(REFRESH_KEY),
  }
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem(ACCESS_KEY, access)
  localStorage.setItem(REFRESH_KEY, refresh)
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(REFRESH_KEY)
}

export const api = axios.create({ baseURL: BASE_URL, timeout: 15000 })

api.interceptors.request.use((config) => {
  const { access } = loadTokens()
  if (access) config.headers.Authorization = `Bearer ${access}`
  return config
})

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

let refreshing: Promise<string | null> | null = null

async function doRefresh(): Promise<string | null> {
  const { refresh } = loadTokens()
  if (!refresh) return null
  try {
    const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refresh_token: refresh })
    setTokens(data.access_token, data.refresh_token)
    return data.access_token
  } catch {
    clearTokens()
    return null
  }
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<{ detail?: string; code?: string }>) => {
    const original = error.config as RetryConfig | undefined
    if (original && error.response?.status === 401 && error.response.data?.code === 'TOKEN_EXPIRE' && !original._retry) {
      original._retry = true
      refreshing ??= doRefresh().finally(() => {
        refreshing = null
      })
      const access = await refreshing
      if (access) {
        original.headers.set('Authorization', `Bearer ${access}`)
        return api(original)
      }
    }
    return Promise.reject(error)
  },
)

export function apiError(e: unknown): string {
  const err = e as AxiosError<{ detail?: string }>
  return err.response?.data?.detail ?? 'Une erreur est survenue.'
}

export function wsUrl(path: string): string {
  const { access } = loadTokens()
  const base = BASE_URL.replace(/^http/, 'ws')
  return `${base}${path}?token=${encodeURIComponent(access ?? '')}`
}
