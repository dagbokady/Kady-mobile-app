import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import Logo from './Logo'
import NotificationsBell from './NotificationsBell'
import { useAuth } from '../store/auth'
import { useTheme } from '../store/theme'

const NAV = [
  { key: 'accueil', to: '/', label: 'Accueil', icon: 'home', match: ['/', '/creer', '/a-propos', '/reglages'] },
  { key: 'decouvrir', to: '/decouvrir', label: 'Découvrir', icon: 'compass', match: ['/decouvrir', '/cercles'] },
  { key: 'messages', to: '/messages', label: 'Messages', icon: 'chatbubbles', match: ['/messages', '/membre'] },
  { key: 'premium', to: '/premium', label: 'Premium', icon: 'diamond', match: ['/premium'] },
]

function isActive(pathname: string, match: string[]): boolean {
  return match.some((m) => (m === '/' ? pathname === '/' : pathname === m || pathname.startsWith(`${m}/`)))
}

export default function Layout() {
  const me = useAuth((s) => s.me)
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [params] = useSearchParams()
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (pathname !== '/decouvrir') setSearch('')
    else setSearch(params.get('q') ?? '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  function onSearch(value: string) {
    setSearch(value)
    navigate(value ? `/decouvrir?q=${encodeURIComponent(value)}` : '/decouvrir', { replace: pathname === '/decouvrir' })
  }

  return (
    <div className="app-shell">
      <header className="navbar">
        <div className="navbar-inner">
          <button className="navbar-logo" type="button" onClick={() => navigate('/')}>
            <Logo size={22} />
            <span className="knav-name">KADY</span>
          </button>

          <nav className="knav">
            {NAV.map((t) => (
              <button
                key={t.key}
                type="button"
                className={`knav-pill${isActive(pathname, t.match) ? ' active' : ''}`}
                onClick={() => navigate(t.to)}
              >
                <ion-icon name={t.icon} />
                <span className="knav-pill-label">{t.label}</span>
              </button>
            ))}
          </nav>

          <div className="knav-search">
            <ion-icon name="search" style={{ fontSize: 17, color: 'rgba(var(--ink),.42)', flexShrink: 0 }} />
            <input
              className="kinput"
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              onFocus={() => pathname !== '/decouvrir' && navigate('/decouvrir')}
              placeholder="Rechercher un cercle, un thème…"
              style={{ fontSize: 13.5 }}
            />
          </div>

          <div style={{ flex: 1 }} />

          <div className="row" style={{ gap: 10, flexShrink: 0 }}>
            <button className="knav-create" type="button" onClick={() => navigate('/creer')}>
              <ion-icon name="add" />
              <span className="knav-pill-label">Créer</span>
            </button>
            <NotificationsBell />
            <button className="icon-btn" type="button" onClick={toggle} aria-label="Changer de thème">
              <ion-icon name={theme === 'light' ? 'moon-outline' : 'sunny-outline'} />
            </button>
            <button className="avatar-btn" type="button" onClick={() => navigate('/profil')} aria-label="Mon profil">
              <div className="avatar-btn-inner">{(me?.prenom ?? me?.email ?? '?')[0]?.toUpperCase()}</div>
            </button>
          </div>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
