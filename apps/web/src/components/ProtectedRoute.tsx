import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../store/auth'

export default function ProtectedRoute() {
  const status = useAuth((s) => s.status)
  if (status !== 'authed') return <Navigate to="/bienvenue" replace />
  return <Outlet />
}
