import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminAuthProvider, useAdminAuth } from './AdminAuth'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Cercles from './pages/Cercles'
import Signalements from './pages/Signalements'
import Config from './pages/Config'

function LoginRoute() {
  const { status } = useAdminAuth()
  if (status === 'authed') return <Navigate to="/" replace />
  return <Login />
}

export default function App() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="/login" element={<LoginRoute />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/utilisateurs" element={<Users />} />
            <Route path="/cercles" element={<Cercles />} />
            <Route path="/signalements" element={<Signalements />} />
            <Route path="/config" element={<Config />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AdminAuthProvider>
  )
}
