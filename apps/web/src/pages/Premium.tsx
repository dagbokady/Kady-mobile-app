import { useEffect, useState } from 'react'
import { premium as premiumApi } from '../api'
import { apiError } from '../api/client'
import type { Abonnement } from '../api/types'

const FEATURES = [
  { icon: 'infinite', t: 'Cercles & messages illimités', s: 'Rejoins autant de cercles que tu veux' },
  { icon: 'eye', t: 'Vois qui consulte ton profil', s: "Sache qui s'intéresse à toi" },
  { icon: 'sparkles', t: 'Découverte accélérée', s: 'Révèle les profils plus vite' },
  { icon: 'stats-chart', t: 'Statistiques de tes liens', s: 'Suis la progression de chaque relation' },
  { icon: 'color-wand', t: 'Thèmes & badges exclusifs', s: 'Personnalise ton expérience' },
  { icon: 'rocket', t: 'Mise en avant de tes cercles', s: 'Plus de visibilité pour tes communautés' },
]

export default function Premium() {
  const [statut, setStatut] = useState<Abonnement | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    premiumApi.statut().then(setStatut).catch((err) => setError(apiError(err)))
  }, [])

  async function upgrader() {
    setError('')
    setBusy(true)
    try {
      const { payment_url } = await premiumApi.init()
      window.location.href = payment_url
    } catch (err) {
      setError(apiError(err))
      setBusy(false)
    }
  }

  return (
    <div style={{ animation: 'kfade .3s ease' }}>
      {/* Hero pleine largeur */}
      <div style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(160deg,#3a1c5e,#8b1d52 60%,#bb1659)' }}>
        <div style={{ position: 'absolute', top: -100, right: -60, width: 360, height: 360, borderRadius: '50%', background: 'rgba(255,120,175,.25)', filter: 'blur(16px)' }} />
        <div className="kwrap" style={{ position: 'relative', padding: '50px 28px 56px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 16px', borderRadius: 99, background: 'rgba(255,255,255,.14)', border: '1px solid rgba(255,255,255,.24)' }}>
            <ion-icon name="diamond" style={{ fontSize: 15, color: '#ffd27a' }} />
            <span style={{ fontSize: 12.5, fontWeight: 700, color: '#fff', letterSpacing: '.5px' }}>KADY PREMIUM</span>
          </div>
          <div style={{ marginTop: 18, fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 42, lineHeight: '48px', color: '#fff', maxWidth: 680, marginLeft: 'auto', marginRight: 'auto' }}>
            Crée plus de liens, sans limites.
          </div>
          <div style={{ marginTop: 14, fontSize: 16, lineHeight: '25px', color: 'rgba(255,255,255,.78)', maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
            Débloque tout le potentiel de KADY et accélère tes connexions, à ton rythme.
          </div>
        </div>
      </div>

      <div className="kwrap" style={{ padding: '0 28px 70px', marginTop: -30, position: 'relative' }}>
        {error && <div className="error-banner" style={{ marginBottom: 16 }}>{error}</div>}

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', maxWidth: 640, margin: '0 auto' }}>
          {statut?.actif ? (
            <div
              style={{
                position: 'relative', flex: 1, padding: '24px 20px', borderRadius: 20, border: '2px solid var(--accent)',
                background: 'var(--card)', textAlign: 'center', boxShadow: 'var(--cardShadow)',
              }}
            >
              <ion-icon name="checkmark-circle" style={{ fontSize: 40, color: 'var(--success)' }} />
              <div style={{ marginTop: 10, fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 22 }}>Premium actif</div>
              <div style={{ marginTop: 6, fontSize: 13.5, color: 'rgba(var(--ink),.55)' }}>
                Profite de KADY sans limites. Merci de soutenir la communauté 💜
              </div>
            </div>
          ) : (
            <div
              style={{
                position: 'relative', flex: 1, padding: '20px 18px', borderRadius: 20, border: '2px solid var(--accent)',
                background: 'rgba(214,40,110,.06)', boxShadow: 'var(--cardShadow)',
              }}
            >
              <div
                style={{
                  position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', padding: '5px 14px',
                  borderRadius: 99, background: 'var(--brand)', boxShadow: '0 6px 12px rgba(224,42,115,.4)', whiteSpace: 'nowrap',
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: '.5px' }}>LE PLUS POPULAIRE</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(var(--ink),.6)' }}>Mensuel</div>
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 34 }}>3 000</span>
                <span style={{ fontSize: 14, color: 'rgba(var(--ink),.5)' }}>FCFA/mois</span>
              </div>
              <div style={{ marginTop: 8, fontSize: 12.5, color: 'rgba(var(--ink),.5)' }}>
                Sans engagement · payé en mobile money (Orange, Wave, MTN, Moov)
              </div>
              <button className="btn btn-primary" type="button" style={{ marginTop: 16, width: '100%', padding: 13, borderRadius: 13 }} onClick={upgrader} disabled={busy}>
                {busy ? 'Redirection…' : 'Choisir'}
              </button>
            </div>
          )}
        </div>

        <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14 }}>
          {FEATURES.map((f) => (
            <div key={f.t} style={{ display: 'flex', alignItems: 'flex-start', gap: 13, padding: 18, borderRadius: 18, background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--cardShadow)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: 'rgba(214,40,110,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ion-icon name={f.icon} style={{ fontSize: 22, color: 'var(--accent)' }} />
              </div>
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 700 }}>{f.t}</div>
                <div style={{ marginTop: 3, fontSize: 12.5, lineHeight: '18px', color: 'rgba(var(--ink),.55)' }}>{f.s}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
