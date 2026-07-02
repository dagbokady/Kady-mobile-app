import { createContext, type ReactNode, useContext, useEffect, useState } from 'react'
import { admin, clearAdminToken, loadAdminToken, setAdminToken } from './api'

type Status = 'loading' | 'authed' | 'guest'

interface AdminAuthState {
  status: Status
  login: (token: string) => Promise<void>
  logout: () => void
}

const Ctx = createContext<AdminAuthState | null>(null)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>('loading')

  useEffect(() => {
    const token = loadAdminToken()
    if (!token) {
      setStatus('guest')
      return
    }
    admin
      .stats()
      .then(() => setStatus('authed'))
      .catch(() => {
        clearAdminToken()
        setStatus('guest')
      })
  }, [])

  async function login(token: string) {
    setAdminToken(token)
    try {
      await admin.stats()
      setStatus('authed')
    } catch (err) {
      clearAdminToken()
      throw err
    }
  }

  function logout() {
    clearAdminToken()
    setStatus('guest')
  }

  return <Ctx.Provider value={{ status, login, logout }}>{children}</Ctx.Provider>
}

export function useAdminAuth() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAdminAuth doit être utilisé sous AdminAuthProvider')
  return ctx
}
