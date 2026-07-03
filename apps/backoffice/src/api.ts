import axios, { type AxiosError } from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'
const TOKEN_KEY = 'kady.admin_token'

export function loadAdminToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setAdminToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearAdminToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export const api = axios.create({ baseURL: BASE_URL, timeout: 15000 })

api.interceptors.request.use((config) => {
  const token = loadAdminToken()
  if (token) config.headers['X-Admin-Token'] = token
  return config
})

export function apiError(e: unknown): string {
  const err = e as AxiosError<{ detail?: string }>
  return err.response?.data?.detail ?? 'Une erreur est survenue.'
}

export interface ChartPoint {
  d: string
  n: number
}

export interface Stats {
  users: number
  users_delta: string | null
  cercles: number
  cercles_delta: string | null
  premium: number
  premium_delta: string | null
  taux_actifs: number
  actifs_7j: number
  reports: number
  verifs: number
  cercles_signales: number
  waitlist: number
  chart: ChartPoint[]
}

export interface AdminUser {
  id: string
  name: string
  email: string
  ville: string | null
  cercles: number
  joined: string
  status: string
  is_active: boolean
  photo: string | null
}

export interface AdminUserDetail {
  id: string
  name: string
  email: string
  ville: string | null
  bio: string | null
  genre: string | null
  centres_interet: string[]
  age: number | null
  joined: string
  status: string
  is_active: boolean
  is_deleted: boolean
  verification: string
  cercles: number
  relations: number
  photo: string | null
  en_pause: boolean
}

export interface AdminVerif {
  id: string
  name: string
  meta: string
  photo: string | null
}

export interface AdminCercle {
  id: string
  nom: string
  theme: string | null
  membres: number
  statut: string
  signale: boolean
  mis_en_avant: boolean
}

export interface AdminSignalement {
  id: string
  target: string
  signale_id: string
  by: string
  reason: string
  contexte: string
  time: string
}

export interface AdminPremium {
  abonnes: number
  mrr: number
  prix: number
  nouveaux_30j: number
  delta: string | null
  conversion: number
  plans: Array<{ label: string; count: number; pct: number }>
}

export interface AppConfigState {
  waitlist_mode: boolean
  maintenance: boolean
  auto_verif: boolean
  premium_promo: boolean
  waitlist_count: number
}

export type ConfigKey = 'waitlist_mode' | 'maintenance' | 'auto_verif' | 'premium_promo'

export const admin = {
  async stats(): Promise<Stats> {
    const { data } = await api.get('/admin/stats')
    return data
  },
  async users(q?: string): Promise<AdminUser[]> {
    const { data } = await api.get('/admin/users', { params: q ? { q } : {} })
    return data
  },
  async userDetail(userId: string): Promise<AdminUserDetail> {
    const { data } = await api.get(`/admin/users/${userId}`)
    return data
  },
  async suspend(userId: string): Promise<{ is_active: boolean }> {
    const { data } = await api.post(`/admin/users/${userId}/suspend`)
    return data
  },
  async ban(userId: string): Promise<{ is_deleted: boolean }> {
    const { data } = await api.post(`/admin/users/${userId}/ban`)
    return data
  },
  async verifications(): Promise<AdminVerif[]> {
    const { data } = await api.get('/admin/verifications')
    return data
  },
  async approveVerif(userId: string) {
    const { data } = await api.post(`/admin/verifications/${userId}/approve`)
    return data
  },
  async rejectVerif(userId: string) {
    const { data } = await api.post(`/admin/verifications/${userId}/reject`)
    return data
  },
  async cercles(): Promise<AdminCercle[]> {
    const { data } = await api.get('/admin/cercles')
    return data
  },
  async toggleCercle(cercleId: string): Promise<{ statut: string }> {
    const { data } = await api.post(`/admin/cercles/${cercleId}/toggle`)
    return data
  },
  async featureCercle(cercleId: string): Promise<{ mis_en_avant: boolean }> {
    const { data } = await api.post(`/admin/cercles/${cercleId}/feature`)
    return data
  },
  async signalements(): Promise<AdminSignalement[]> {
    const { data } = await api.get('/admin/signalements')
    return data
  },
  async actionSignalement(id: string, action: 'ignorer' | 'avertir' | 'suspendre') {
    const { data } = await api.post(`/admin/signalements/${id}/action`, null, { params: { action } })
    return data as { statut: string; action: string }
  },
  async premium(): Promise<AdminPremium> {
    const { data } = await api.get('/admin/premium')
    return data
  },
  async getConfig(): Promise<AppConfigState> {
    const { data } = await api.get('/admin/config')
    return data
  },
  async setConfig(cle: ConfigKey, valeur: boolean) {
    const { data } = await api.post('/admin/config', null, { params: { cle, valeur } })
    return data
  },
}
