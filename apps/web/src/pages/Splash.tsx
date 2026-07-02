import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import HowModal from '../components/HowModal'

export default function Splash() {
  const navigate = useNavigate()
  const [showHow, setShowHow] = useState(false)

  return (
    <div className="splash">
      <div className="splash-aura splash-aura-1" />
      <div className="splash-aura splash-aura-2" />
      <div className="splash-inner">
        <Logo size={74} />
        <div className="splash-title">KADY</div>
        <div className="splash-tagline">Des liens qui comptent, en cercle.</div>
        <p className="splash-desc">
          Rejoignez de petites communautés autour de vos passions. Pas de swipe, pas de messages non sollicités — la
          confiance se construit, niveau après niveau.
        </p>
        <div className="splash-actions">
          <button className="splash-cta" type="button" onClick={() => navigate('/inscription')}>
            Créer un compte
            <ion-icon name="arrow-forward" style={{ fontSize: 18 }} />
          </button>
          <button className="splash-ghost" type="button" onClick={() => navigate('/login')}>
            J'ai déjà un compte
          </button>
          <button
            type="button"
            onClick={() => setShowHow(true)}
            style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <ion-icon name="help-circle-outline" style={{ fontSize: 16, color: 'rgba(255,255,255,.6)' }} />
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,.6)' }}>Comment ça marche ?</span>
          </button>
        </div>
      </div>
      {showHow && <HowModal onClose={() => setShowHow(false)} />}
    </div>
  )
}
