import { Navigate, Outlet } from 'react-router-dom'
import { useAdminAuth } from '../AdminAuth'

export default function ProtectedRoute() {
  const { status } = useAdminAuth()
  if (status === 'loading') return <div className="empty">Chargement…</div>
  if (status !== 'authed') return <Navigate to="/login" replace />
  return <Outlet />
}
