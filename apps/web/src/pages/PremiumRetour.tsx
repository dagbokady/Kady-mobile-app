import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { premium as premiumApi } from '../api'
import { apiError } from '../api/client'
import type { Abonnement } from '../api/types'
import { useAuth } from '../store/auth'

export default function PremiumRetour() {
  const navigate = useNavigate()
  const refreshMe = useAuth((s) => s.refreshMe)
  const [statut, setStatut] = useState<Abonnement | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    premiumApi
      .statut()
      .then(async (s) => {
        setStatut(s)
        if (s.actif) await refreshMe()
      })
      .catch((err) => setError(apiError(err)))
  }, [refreshMe])

  return (
    <div className="kwrap" style={{ maxWidth: 560, padding: '60px 28px 70px', textAlign: 'center', animation: 'kfade .3s ease' }}>
      {error && <div className="error-banner">{error}</div>}
      {!statut ? (
        <p className="empty">Vérification du paiement…</p>
      ) : statut.actif ? (
        <div className="stack" style={{ alignItems: 'center', gap: 12 }}>
          <div style={{ width: 84, height: 84, borderRadius: 28, background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 14px 30px rgba(224,42,115,.4)' }}>
            <ion-icon name="diamond" style={{ fontSize: 40, color: '#fff' }} />
          </div>
          <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 28 }}>Bienvenue dans Premium !</div>
          <p className="subtitle">Ton abonnement est actif. Profite de KADY sans limites.</p>
        </div>
      ) : (
        <div className="stack" style={{ alignItems: 'center', gap: 12 }}>
          <div style={{ width: 84, height: 84, borderRadius: 28, background: 'var(--field)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ion-icon name="time-outline" style={{ fontSize: 40, color: 'var(--accentDeep)' }} />
          </div>
          <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 26 }}>Paiement en cours de confirmation</div>
          <p className="subtitle">
            Ton paiement mobile money est en cours de traitement. Ton statut sera mis à jour dès sa confirmation.
          </p>
        </div>
      )}
      <button className="btn btn-primary" type="button" style={{ marginTop: 26 }} onClick={() => navigate('/')}>
        Retour à l'accueil
      </button>
    </div>
  )
}
