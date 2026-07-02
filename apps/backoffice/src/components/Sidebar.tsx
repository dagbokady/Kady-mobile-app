import { NavLink } from 'react-router-dom'
import { useAdminAuth } from '../AdminAuth'

const links = [
  { to: '/', label: 'Tableau de bord', end: true },
  { to: '/utilisateurs', label: 'Utilisateurs', end: false },
  { to: '/cercles', label: 'Cercles', end: false },
  { to: '/signalements', label: 'Signalements', end: false },
  { to: '/config', label: 'Configuration', end: false },
]

export default function Sidebar() {
  const { logout } = useAdminAuth()
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">KADY Admin</div>
      {links.map((l) => (
        <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
          {l.label}
        </NavLink>
      ))}
      <div className="sidebar-footer">
        <button className="btn btn-ghost" type="button" onClick={logout} style={{ width: '100%' }}>
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
