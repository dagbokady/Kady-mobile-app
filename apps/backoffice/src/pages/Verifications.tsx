import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { type AdminVerif, admin, apiError } from '../api'
import type { AdminOutletContext } from '../components/Layout'
import { avatarGrad } from '../visuals'
import { toast } from '../toast'

export default function Verifications() {
  const { q, refreshBadges } = useOutletContext<AdminOutletContext>()
  const [items, setItems] = useState<AdminVerif[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    admin
      .verifications()
      .then(setItems)
      .catch((err) => setError(apiError(err)))
      .finally(() => setLoading(false))
  }, [])

  const query = q.trim().toLowerCase()
  const displayed = items.filter((v) => !query || v.name.toLowerCase().includes(query))

  async function traiter(v: AdminVerif, action: 'approve' | 'reject') {
    try {
      if (action === 'approve') await admin.approveVerif(v.id)
      else await admin.rejectVerif(v.id)
      setItems((prev) => prev.filter((x) => x.id !== v.id))
      toast(action === 'approve' ? `✓ ${v.name} approuvé·e` : `✕ ${v.name} rejeté·e`)
      refreshBadges()
    } catch (err) {
      toast(apiError(err))
    }
  }

  if (error) return <div className="error-banner">{error}</div>
  if (loading) return <div className="empty-state">Chargement…</div>

  return (
    <div style={{ animation: 'kf .3s ease', display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
      {displayed.map((v) => (
        <div key={v.id} className="acard" style={{ overflow: 'hidden' }}>
          <div style={{ position: 'relative', height: 200, background: avatarGrad(v.id), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {v.photo ? (
              <img src={v.photo} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 56, color: '#fff' }}>{v.name[0]?.toUpperCase()}</span>
            )}
            <div style={{ position: 'absolute', top: 10, left: 10, padding: '4px 10px', borderRadius: 99, background: 'rgba(0,0,0,.4)', backdropFilter: 'blur(6px)', fontSize: 11, fontWeight: 700, color: '#fff' }}>
              Selfie + Photo
            </div>
          </div>
          <div style={{ padding: '14px 16px' }}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{v.name}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{v.meta}</div>
            <div style={{ marginTop: 13, display: 'flex', gap: 8 }}>
              <button type="button" className="btn btn-danger-soft" style={{ flex: 1, padding: 10 }} onClick={() => traiter(v, 'reject')}>
                Rejeter
              </button>
              <button type="button" className="btn btn-brand" style={{ flex: 1.4, padding: 10 }} onClick={() => traiter(v, 'approve')}>
                Approuver
              </button>
            </div>
          </div>
        </div>
      ))}
      {displayed.length === 0 && (
        <div className="empty-state" style={{ gridColumn: '1/-1' }}>
          <ion-icon name="checkmark-circle-outline" style={{ fontSize: 44 }} />
          <div style={{ marginTop: 10, fontSize: 15, fontWeight: 600 }}>File vide — tout est vérifié ✓</div>
        </div>
      )}
    </div>
  )
}
