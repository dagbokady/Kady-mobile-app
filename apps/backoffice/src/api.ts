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

export interface Stats {
  users: number
  actifs: number
  cercles: number
  premium: number
  waitlist: number
  reports: number
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
}

export interface AdminCercle {
  id: string
  nom: string
  theme: string | null
  membres: number
  statut: string
}

export interface AdminSignalement {
  id: string
  contexte: string
  motif: string | null
  time: string
}

export interface AppConfigState {
  waitlist_mode: boolean
  maintenance: boolean
}

export const admin = {
  async stats(): Promise<Stats> {
    const { data } = await api.get('/admin/stats')
    return data
  },
  async users(q?: string): Promise<AdminUser[]> {
    const { data } = await api.get('/admin/users', { params: q ? { q } : {} })
    return data
  },
  async suspend(userId: string): Promise<{ is_active: boolean }> {
    const { data } = await api.post(`/admin/users/${userId}/suspend`)
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
  async signalements(): Promise<AdminSignalement[]> {
    const { data } = await api.get('/admin/signalements')
    return data
  },
  async resolveSignalement(id: string, statut: 'traite' | 'rejete'): Promise<{ statut: string }> {
    const { data } = await api.post(`/admin/signalements/${id}/resolve`, null, { params: { statut } })
    return data
  },
  async getConfig(): Promise<AppConfigState> {
    const { data } = await api.get('/admin/config')
    return data
  },
  async setConfig(cle: 'waitlist_mode' | 'maintenance', valeur: boolean) {
    const { data } = await api.post('/admin/config', null, { params: { cle, valeur } })
    return data
  },
}
