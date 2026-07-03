import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminAuthProvider, useAdminAuth } from './AdminAuth'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Verifications from './pages/Verifications'
import Cercles from './pages/Cercles'
import Signalements from './pages/Signalements'
import Premium from './pages/Premium'
import Reglages from './pages/Reglages'

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
            <Route path="/verifications" element={<Verifications />} />
            <Route path="/cercles" element={<Cercles />} />
            <Route path="/signalements" element={<Signalements />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/reglages" element={<Reglages />} />
            <Route path="/config" element={<Navigate to="/reglages" replace />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AdminAuthProvider>
  )
}
