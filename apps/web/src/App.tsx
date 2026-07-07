import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './store/auth'
import { useConfig } from './store/config'
import './store/theme'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Splash from './pages/Splash'
import Maintenance from './pages/Maintenance'
import Waitlist from './pages/Waitlist'
import Login from './pages/Login'
import Register from './pages/Register'
import Onboarding from './pages/Onboarding'
import Accueil from './pages/Accueil'
import Decouvrir from './pages/Decouvrir'
import Cercle from './pages/Cercle'
import CercleChat from './pages/CercleChat'
import Messages from './pages/Messages'
import MessagesEmpty from './pages/MessagesEmpty'
import ChatDm from './pages/ChatDm'
import Profil from './pages/Profil'
import MembreProfil from './pages/MembreProfil'
import Premium from './pages/Premium'
import PremiumRetour from './pages/PremiumRetour'
import Reglages from './pages/Reglages'
import Creer from './pages/Creer'
import APropos from './pages/APropos'
import Toast from './components/Toast'

export default function App() {
  const status = useAuth((s) => s.status)
  const bootstrap = useAuth((s) => s.bootstrap)
  const mode = useConfig((s) => s.mode)
  const configLoaded = useConfig((s) => s.loaded)
  const loadConfig = useConfig((s) => s.load)

  useEffect(() => {
    bootstrap()
    loadConfig()
  }, [bootstrap, loadConfig])

  if (status === 'loading' || !configLoaded) {
    return <div className="empty">Chargement…</div>
  }

  const guest = status !== 'authed'

  // Maintenance : coupe l'accès à tout le monde (l'admin passe par le back-office séparé).
  if (mode === 'maintenance') {
    return <Maintenance />
  }

  const waitlist = mode === 'waitlist'

  return (
    <>
      <Toast />
      <Routes>
      <Route path="/bienvenue" element={guest ? (waitlist ? <Waitlist /> : <Splash />) : <Navigate to="/" replace />} />
      <Route path="/login" element={guest ? <Login /> : <Navigate to="/" replace />} />
      <Route path="/inscription" element={guest ? (waitlist ? <Navigate to="/bienvenue" replace /> : <Register />) : <Navigate to="/" replace />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Accueil />} />
          <Route path="/decouvrir" element={<Decouvrir />} />
          <Route path="/cercles/:id" element={<Cercle />} />
          <Route path="/cercles/:id/chat" element={<CercleChat />} />
          <Route path="/messages" element={<Messages />}>
            <Route index element={<MessagesEmpty />} />
            <Route path=":id" element={<ChatDm />} />
          </Route>
          <Route path="/membre/:id" element={<MembreProfil />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/premium/retour" element={<PremiumRetour />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/reglages" element={<Reglages />} />
          <Route path="/creer" element={<Creer />} />
          <Route path="/a-propos" element={<APropos />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
