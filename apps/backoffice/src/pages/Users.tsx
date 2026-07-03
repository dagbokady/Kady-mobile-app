import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { type AdminUser, type AdminUserDetail, admin, apiError } from '../api'
import type { AdminOutletContext } from '../components/Layout'
import { avatarGrad, statusColors } from '../visuals'
import { toast } from '../toast'

const FILTERS = ['Tous', 'Actifs', 'Premium', 'Suspendus'] as const

export default function Users() {
  const { q, refreshBadges } = useOutletContext<AdminOutletContext>()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('Tous')
  const [detail, setDetail] = useState<AdminUserDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    admin
      .users()
      .then(setUsers)
      .catch((err) => setError(apiError(err)))
      .finally(() => setLoading(false))
  }, [])

  const query = q.trim().toLowerCase()
  const displayed = users.filter((u) => {
    if (filter === 'Actifs' && u.status !== 'Actif' && u.status !== 'Premium') return false
    if (filter === 'Premium' && u.status !== 'Premium') return false
    if (filter === 'Suspendus' && u.status !== 'Suspendu') return false
    if (query && !(u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query))) return false
    return true
  })

  async function ouvrir(u: AdminUser) {
    try {
      setDetail(await admin.userDetail(u.id))
    } catch (err) {
      toast(apiError(err))
    }
  }

  async function suspendre(d: AdminUserDetail) {
    try {
      const res = await admin.suspend(d.id)
      toast(res.is_active ? `▶ ${d.name} réactivé·e` : `⏸ ${d.name} suspendu·e`)
      setDetail({ ...d, is_active: res.is_active, status: res.is_active ? 'Actif' : 'Suspendu' })
      setUsers((prev) => prev.map((u) => (u.id === d.id ? { ...u, is_active: res.is_active, status: res.is_active ? 'Actif' : 'Suspendu' } : u)))
      refreshBadges()
    } catch (err) {
      toast(apiError(err))
    }
  }

  async function bannir(d: AdminUserDetail) {
    if (!window.confirm(`Bannir définitivement ${d.name} ? Le compte sera désactivé et retiré de la plateforme.`)) return
    try {
      await admin.ban(d.id)
      toast(`⛔ ${d.name} banni·e définitivement`)
      setUsers((prev) => prev.filter((u) => u.id !== d.id))
      setDetail(null)
      refreshBadges()
    } catch (err) {
      toast(apiError(err))
    }
  }

  return (
    <>
      <div className="acard" style={{ animation: 'kf .3s ease', overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', display: 'flex', gap: 8, flexWrap: 'wrap', borderBottom: '1px solid var(--border)' }}>
          {FILTERS.map((f) => (
            <button key={f} type="button" className={`filter-chip${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>

        <div
          style={{
            display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 40px', gap: 12, padding: '11px 18px',
            borderBottom: '1px solid var(--border)', fontSize: 11, fontWeight: 700, letterSpacing: '.5px',
            textTransform: 'uppercase', color: 'var(--muted)',
          }}
        >
          <div>Utilisateur</div>
          <div>Statut</div>
          <div>Cercles</div>
          <div>Inscrit</div>
          <div />
        </div>

        {error && <div className="error-banner" style={{ margin: 14 }}>{error}</div>}
        {loading ? (
          <div className="empty-state">Chargement…</div>
        ) : displayed.length === 0 ? (
          <div className="empty-state">Aucun utilisateur ne correspond.</div>
        ) : (
          displayed.map((u) => {
            const [c, b] = statusColors(u.status)
            return (
              <button
                key={u.id}
                type="button"
                onClick={() => ouvrir(u)}
                style={{
                  display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 40px', gap: 12, padding: '13px 18px',
                  borderBottom: '1px solid var(--border)', alignItems: 'center', textAlign: 'left', width: '100%',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: avatarGrad(u.id), flexShrink: 0, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {u.photo ? (
                      <img src={u.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 15, color: '#fff' }}>{u.name[0]?.toUpperCase()}</span>
                    )}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{u.email}</div>
                  </div>
                </div>
                <div>
                  <span className="chip-status" style={{ background: b, color: c }}>{u.status}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>{u.cercles}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>{u.joined}</div>
                <ion-icon name="chevron-forward" style={{ fontSize: 18, color: 'var(--muted)' }} />
              </button>
            )
          })
        )}
      </div>

      {detail && (
        <>
          <div className="drawer-overlay" onClick={() => setDetail(null)} />
          <div className="drawer ks">
            <div style={{ height: 150, background: avatarGrad(detail.id), position: 'relative' }}>
              <button
                type="button"
                onClick={() => setDetail(null)}
                aria-label="Fermer"
                style={{ position: 'absolute', top: 14, right: 14, width: 36, height: 36, borderRadius: 11, background: 'rgba(0,0,0,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <ion-icon name="close" style={{ fontSize: 20, color: '#fff' }} />
              </button>
            </div>
            <div style={{ padding: '0 22px 26px', marginTop: -44 }}>
              <div style={{ width: 88, height: 88, borderRadius: 24, border: '4px solid var(--bg)', background: avatarGrad(detail.id), overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {detail.photo ? (
                  <img src={detail.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 32, color: '#fff' }}>{detail.name[0]?.toUpperCase()}</span>
                )}
              </div>
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 22 }}>{detail.name}</span>
                {(() => {
                  const [c, b] = statusColors(detail.status)
                  return <span className="chip-status" style={{ background: b, color: c }}>{detail.status}</span>
                })()}
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 3 }}>{detail.email}</div>

              <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                {[
                  { v: detail.cercles, l: 'Cercles' },
                  { v: detail.age ?? '—', l: 'Âge' },
                  { v: detail.relations, l: 'Relations' },
                ].map((st) => (
                  <div key={st.l} style={{ padding: 13, borderRadius: 13, background: 'var(--card)', border: '1px solid var(--border)', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 19 }}>{st.v}</div>
                    <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 2 }}>{st.l}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 18, fontSize: 11, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', color: 'var(--muted)' }}>Infos</div>
              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 9 }}>
                {[
                  { icon: 'location-outline', l: 'Ville', v: detail.ville ?? '—' },
                  { icon: 'shield-checkmark-outline', l: 'Vérif.', v: detail.verification },
                  { icon: 'calendar-outline', l: 'Inscrit', v: detail.joined },
                  { icon: 'pause-circle-outline', l: 'Pause', v: detail.en_pause ? 'Activée' : 'Non' },
                ].map((i) => (
                  <div key={i.l} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 13px', borderRadius: 12, background: 'var(--card)', border: '1px solid var(--border)' }}>
                    <ion-icon name={i.icon} style={{ fontSize: 17, color: 'var(--muted)' }} />
                    <span style={{ fontSize: 12, color: 'var(--muted)', flex: 1 }}>{i.l}</span>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{i.v}</span>
                  </div>
                ))}
              </div>

              {detail.bio && (
                <div style={{ marginTop: 12, padding: '11px 13px', borderRadius: 12, background: 'var(--card)', border: '1px solid var(--border)', fontSize: 12.5, color: 'var(--muted)', lineHeight: '18px' }}>
                  {detail.bio}
                </div>
              )}
              {detail.centres_interet.length > 0 && (
                <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {detail.centres_interet.map((i) => (
                    <span key={i} style={{ padding: '4px 10px', borderRadius: 99, background: 'var(--field)', fontSize: 11, fontWeight: 600, color: 'var(--muted)' }}>
                      #{i}
                    </span>
                  ))}
                </div>
              )}

              <div style={{ marginTop: 20, display: 'flex', gap: 9 }}>
                <button type="button" className="btn btn-warn-soft" style={{ flex: 1, padding: 12, borderRadius: 12 }} onClick={() => suspendre(detail)}>
                  {detail.is_active ? 'Suspendre' : 'Réactiver'}
                </button>
                <button type="button" className="btn btn-danger-soft" style={{ flex: 1, padding: 12, borderRadius: 12 }} onClick={() => bannir(detail)}>
                  Bannir
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
