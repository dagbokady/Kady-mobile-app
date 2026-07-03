import { useCallback, useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { admin } from '../api'
import { useAdminAuth } from '../AdminAuth'
import { useTheme } from '../theme'
import { Toast } from '../toast'

const NAV = [
  { to: '/', label: 'Tableau de bord', icon: 'grid', key: 'dash' },
  { to: '/utilisateurs', label: 'Utilisateurs', icon: 'people', key: 'users' },
  { to: '/verifications', label: 'Vérifications', icon: 'shield-checkmark', key: 'verif' },
  { to: '/cercles', label: 'Cercles', icon: 'people-circle', key: 'cercles' },
  { to: '/signalements', label: 'Signalements', icon: 'flag', key: 'reports' },
  { to: '/premium', label: 'Premium & revenus', icon: 'diamond', key: 'premium' },
  { to: '/reglages', label: 'Réglages', icon: 'settings', key: 'settings' },
]

const TITLES: Record<string, string> = {
  '/': 'Tableau de bord',
  '/utilisateurs': 'Utilisateurs',
  '/verifications': 'Vérifications',
  '/cercles': 'Cercles',
  '/signalements': 'Signalements',
  '/premium': 'Premium & revenus',
  '/reglages': 'Réglages',
}

export interface AdminOutletContext {
  q: string
  refreshBadges: () => void
}

export default function Layout() {
  const { logout } = useAdminAuth()
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [q, setQ] = useState('')
  const [badges, setBadges] = useState<{ verif: number; reports: number }>({ verif: 0, reports: 0 })

  const refreshBadges = useCallback(() => {
    admin
      .stats()
      .then((s) => setBadges({ verif: s.verifs, reports: s.reports }))
      .catch(() => {})
  }, [])

  useEffect(() => {
    refreshBadges()
  }, [refreshBadges, pathname])

  useEffect(() => {
    setQ('')
  }, [pathname])

  return (
    <div className="admin-shell">
      <aside className="sb">
        <div style={{ padding: '24px 22px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="32" height="20" viewBox="0 0 132 82" fill="none">
            <defs>
              <linearGradient id="ka" x1="14" y1="6" x2="120" y2="78" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#ffc2d6" />
                <stop offset=".5" stopColor="#ff5f9e" />
                <stop offset="1" stopColor="#bb1659" />
              </linearGradient>
            </defs>
            <circle cx="86" cy="41" r="27" stroke="url(#ka)" strokeWidth="13.5" />
            <circle cx="46" cy="41" r="27" stroke="url(#ka)" strokeWidth="13.5" />
            <path d="M66 58.9 A27 27 0 0 0 80 66.4" stroke="url(#ka)" strokeWidth="13.5" strokeLinecap="round" />
          </svg>
          <div>
            <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 17, letterSpacing: 3 }}>KADY</div>
            <div style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(var(--sbink),.5)' }}>ADMIN</div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {NAV.map((n) => {
            const active = n.to === '/' ? pathname === '/' : pathname.startsWith(n.to)
            const badge = n.key === 'verif' ? badges.verif : n.key === 'reports' ? badges.reports : 0
            return (
              <button key={n.to} type="button" className={`sb-nav-item${active ? ' active' : ''}`} onClick={() => navigate(n.to)}>
                <ion-icon name={n.icon} />
                <span style={{ fontSize: 14, fontWeight: 600, flex: 1, textAlign: 'left' }}>{n.label}</span>
                {badge > 0 && <span className="sb-badge">{badge}</span>}
              </button>
            )
          })}
        </nav>

        <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', gap: 11 }}>
          <div
            style={{
              width: 38, height: 38, borderRadius: 12, background: 'var(--brand)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontFamily: 'Sora,sans-serif', fontWeight: 700, color: '#fff',
            }}
          >
            A
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Admin KADY</div>
            <div style={{ fontSize: 11, color: 'rgba(var(--sbink),.5)' }}>Super-admin</div>
          </div>
          <button
            type="button"
            onClick={logout}
            aria-label="Déconnexion"
            style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <ion-icon name="log-out-outline" style={{ fontSize: 16, color: 'rgba(var(--sbink),.7)' }} />
          </button>
        </div>
      </aside>

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <header className="admin-header">
          <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 20 }}>{TITLES[pathname] ?? 'KADY Admin'}</div>
          <div style={{ flex: 1 }} />
          <div className="admin-search">
            <ion-icon name="search" style={{ fontSize: 16, color: 'var(--muted)' }} />
            <input className="kin" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher…" />
          </div>
          <button className="icon-btn" type="button" onClick={toggle} aria-label="Changer de thème">
            <ion-icon name={theme === 'light' ? 'moon-outline' : 'sunny-outline'} />
          </button>
        </header>

        <main className="ks" style={{ flex: 1, overflowY: 'auto', padding: 26 }}>
          <Outlet context={{ q, refreshBadges } satisfies AdminOutletContext} />
        </main>
      </div>

      <Toast />
    </div>
  )
}
