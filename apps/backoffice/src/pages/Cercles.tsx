import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { type AdminCercle, admin, apiError } from '../api'
import type { AdminOutletContext } from '../components/Layout'
import { statusColors, themeGrad } from '../visuals'
import { toast } from '../toast'

function statusLabel(c: AdminCercle): string {
  if (c.signale) return 'Signalé'
  if (c.statut === 'actif') return 'Actif'
  if (c.statut === 'archive') return 'Archivé'
  return 'Expiré'
}

export default function Cercles() {
  const { q } = useOutletContext<AdminOutletContext>()
  const [cercles, setCercles] = useState<AdminCercle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    admin
      .cercles()
      .then(setCercles)
      .catch((err) => setError(apiError(err)))
      .finally(() => setLoading(false))
  }, [])

  const query = q.trim().toLowerCase()
  const displayed = cercles.filter((c) => !query || c.nom.toLowerCase().includes(query) || (c.theme ?? '').toLowerCase().includes(query))

  async function basculer(c: AdminCercle) {
    try {
      const res = await admin.toggleCercle(c.id)
      setCercles((prev) => prev.map((x) => (x.id === c.id ? { ...x, statut: res.statut } : x)))
      toast(res.statut === 'actif' ? `▶ « ${c.nom} » réactivé` : `⏸ « ${c.nom} » suspendu`)
    } catch (err) {
      toast(apiError(err))
    }
  }

  async function mettreEnAvant(c: AdminCercle) {
    try {
      const res = await admin.featureCercle(c.id)
      setCercles((prev) => prev.map((x) => (x.id === c.id ? { ...x, mis_en_avant: res.mis_en_avant } : x)))
      toast(res.mis_en_avant ? `★ « ${c.nom} » mis en avant` : `☆ « ${c.nom} » retiré de la mise en avant`)
    } catch (err) {
      toast(apiError(err))
    }
  }

  if (error) return <div className="error-banner">{error}</div>
  if (loading) return <div className="empty-state">Chargement…</div>

  return (
    <div style={{ animation: 'kf .3s ease', display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 16 }}>
      {displayed.map((c) => {
        const label = statusLabel(c)
        const [col, bg] = statusColors(label)
        const suspendu = c.statut !== 'actif'
        return (
          <div key={c.id} className="acard" style={{ overflow: 'hidden' }}>
            <div style={{ height: 90, background: themeGrad(c.theme), position: 'relative' }}>
              {c.mis_en_avant && (
                <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 99, background: 'rgba(0,0,0,.35)', backdropFilter: 'blur(4px)' }}>
                  <ion-icon name="star" style={{ fontSize: 11, color: '#ffd27a' }} />
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: '#ffe7b0' }}>En avant</span>
                </div>
              )}
              <span style={{ position: 'absolute', left: 14, bottom: 10, fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 17, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,.3)' }}>
                {c.nom}
              </span>
            </div>
            <div style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>
                  {c.membres} membre{c.membres > 1 ? 's' : ''}{c.theme ? ` · ${c.theme}` : ''}
                </span>
                <span className="chip-status" style={{ background: bg, color: col }}>{label}</span>
              </div>
              <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  className="btn btn-field"
                  style={{ flex: 1, padding: 9, fontSize: 12.5, color: suspendu ? '#1f9d57' : '#e02a2a' }}
                  onClick={() => basculer(c)}
                >
                  {suspendu ? 'Réactiver' : 'Suspendre'}
                </button>
                <button
                  type="button"
                  className="btn btn-field"
                  style={{ padding: '9px 12px', fontSize: 12.5, color: 'var(--accent)' }}
                  onClick={() => mettreEnAvant(c)}
                  aria-label="Mettre en avant"
                >
                  <ion-icon name={c.mis_en_avant ? 'star' : 'star-outline'} style={{ fontSize: 14 }} />
                </button>
              </div>
            </div>
          </div>
        )
      })}
      {displayed.length === 0 && <div className="empty-state" style={{ gridColumn: '1/-1' }}>Aucun cercle.</div>}
    </div>
  )
}
