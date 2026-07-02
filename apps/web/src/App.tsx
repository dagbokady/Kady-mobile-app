import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './store/auth'
import './store/theme'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Splash from './pages/Splash'
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

  useEffect(() => {
    bootstrap()
  }, [bootstrap])

  if (status === 'loading') {
    return <div className="empty">Chargement…</div>
  }

  const guest = status !== 'authed'

  return (
    <>
      <Toast />
      <Routes>
      <Route path="/bienvenue" element={guest ? <Splash /> : <Navigate to="/" replace />} />
      <Route path="/login" element={guest ? <Login /> : <Navigate to="/" replace />} />
      <Route path="/inscription" element={guest ? <Register /> : <Navigate to="/" replace />} />
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
