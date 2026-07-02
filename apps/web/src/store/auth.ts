import { create } from 'zustand'
import { auth } from '../api'
import { clearTokens, loadTokens } from '../api/client'
import type { Me } from '../api/types'

interface AuthState {
  status: 'loading' | 'authed' | 'guest'
  me: Me | null
  bootstrap: () => Promise<void>
  login: (email: string, password: string) => Promise<void>
  register: (payload: Parameters<typeof auth.register>[0]) => Promise<void>
  refreshMe: () => Promise<void>
  logout: () => void
}

export const useAuth = create<AuthState>((set) => ({
  status: 'loading',
  me: null,
  async bootstrap() {
    const { access } = loadTokens()
    if (!access) {
      set({ status: 'guest', me: null })
      return
    }
    try {
      const me = await auth.me()
      set({ status: 'authed', me })
    } catch {
      clearTokens()
      set({ status: 'guest', me: null })
    }
  },
  async login(email, password) {
    await auth.login(email, password)
    const me = await auth.me()
    set({ status: 'authed', me })
  },
  async register(payload) {
    await auth.register(payload)
    const me = await auth.me()
    set({ status: 'authed', me })
  },
  async refreshMe() {
    const me = await auth.me()
    set({ me })
  },
  logout() {
    auth.logout()
    set({ status: 'guest', me: null })
  },
}))
