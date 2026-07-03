import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { type AdminSignalement, admin, apiError } from '../api'
import type { AdminOutletContext } from '../components/Layout'
import { toast } from '../toast'

export default function Signalements() {
  const { q, refreshBadges } = useOutletContext<AdminOutletContext>()
  const [items, setItems] = useState<AdminSignalement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    admin
      .signalements()
      .then(setItems)
      .catch((err) => setError(apiError(err)))
      .finally(() => setLoading(false))
  }, [])

  const query = q.trim().toLowerCase()
  const displayed = items.filter((r) => !query || r.target.toLowerCase().includes(query) || r.reason.toLowerCase().includes(query))

  async function traiter(r: AdminSignalement, action: 'ignorer' | 'avertir' | 'suspendre') {
    try {
      await admin.actionSignalement(r.id, action)
      setItems((prev) => prev.filter((x) => x.id !== r.id))
      const labels = { ignorer: 'Ignoré', avertir: 'Avertissement envoyé', suspendre: 'Suspendu' }
      toast(`${labels[action]} · ${r.target}`)
      refreshBadges()
    } catch (err) {
      toast(apiError(err))
    }
  }

  if (error) return <div className="error-banner">{error}</div>
  if (loading) return <div className="empty-state">Chargement…</div>

  return (
    <div style={{ animation: 'kf .3s ease', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {displayed.map((r) => (
        <div key={r.id} className="acard" style={{ padding: '16px 18px', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(224,42,42,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ion-icon name="flag" style={{ fontSize: 21, color: '#e02a2a' }} />
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>
              {r.target} <span style={{ color: 'var(--muted)', fontWeight: 500 }}>signalé·e</span>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>
              {r.reason} · par {r.by} · {r.time}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="btn btn-field" style={{ padding: '9px 14px', fontSize: 12.5 }} onClick={() => traiter(r, 'ignorer')}>
              Ignorer
            </button>
            <button type="button" className="btn btn-warn-soft" style={{ padding: '9px 14px', fontSize: 12.5 }} onClick={() => traiter(r, 'avertir')}>
              Avertir
            </button>
            <button type="button" className="btn btn-danger-soft" style={{ padding: '9px 14px', fontSize: 12.5 }} onClick={() => traiter(r, 'suspendre')}>
              Suspendre
            </button>
          </div>
        </div>
      ))}
      {displayed.length === 0 && (
        <div className="empty-state">
          <ion-icon name="shield-checkmark-outline" style={{ fontSize: 44 }} />
          <div style={{ marginTop: 10, fontSize: 15, fontWeight: 600 }}>Aucun signalement en attente ✓</div>
        </div>
      )}
    </div>
  )
}
