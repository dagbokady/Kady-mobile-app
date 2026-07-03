import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { admin, apiError, type Stats } from '../api'
import { fmtNombre } from '../visuals'

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    admin.stats().then(setStats).catch((err) => setError(apiError(err)))
  }, [])

  if (error) return <div className="error-banner">{error}</div>
  if (!stats) return <div className="empty-state">Chargement…</div>

  const kpis = [
    { icon: 'people', tint: '#d6286e', bg: 'rgba(214,40,110,.12)', val: fmtNombre(stats.users), label: 'Utilisateurs', delta: stats.users_delta },
    { icon: 'people-circle', tint: '#5a7fd6', bg: 'rgba(90,127,214,.14)', val: fmtNombre(stats.cercles), label: 'Cercles actifs', delta: stats.cercles_delta },
    { icon: 'diamond', tint: '#b01b5c', bg: 'rgba(214,40,110,.12)', val: fmtNombre(stats.premium), label: 'Abonnés Premium', delta: stats.premium_delta },
    { icon: 'pulse', tint: '#1f9d57', bg: 'rgba(31,157,87,.12)', val: `${stats.taux_actifs}%`, label: 'Actifs / 7 j', delta: null },
  ]

  const queues = [
    { icon: 'shield-checkmark', tint: '#5a7fd6', bg: 'rgba(90,127,214,.14)', label: 'Vérifications', sub: 'selfies en attente', n: stats.verifs, to: '/verifications' },
    { icon: 'flag', tint: '#e02a2a', bg: 'rgba(224,42,42,.1)', label: 'Signalements', sub: 'à traiter', n: stats.reports, to: '/signalements' },
    { icon: 'people-circle', tint: '#c2740d', bg: 'rgba(224,138,27,.14)', label: 'Cercles signalés', sub: 'à modérer', n: stats.cercles_signales, to: '/cercles' },
  ]

  const maxChart = Math.max(1, ...stats.chart.map((b) => b.n))
  const totalInscriptions = stats.chart.reduce((a, b) => a + b.n, 0)

  return (
    <div style={{ animation: 'kf .3s ease' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
        {kpis.map((k) => (
          <div key={k.label} className="acard" style={{ padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ion-icon name={k.icon} style={{ fontSize: 19, color: k.tint }} />
              </div>
              {k.delta && (
                <span style={{ fontSize: 12, fontWeight: 700, color: k.delta.startsWith('-') ? '#c2740d' : '#1f9d57' }}>
                  {k.delta}
                </span>
              )}
            </div>
            <div style={{ marginTop: 13, fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 27 }}>{k.val}</div>
            <div style={{ marginTop: 2, fontSize: 12.5, color: 'var(--muted)' }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 18, alignItems: 'start' }}>
        <div className="acard" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 16 }}>Inscriptions · 14 jours</div>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>
              {totalInscriptions} inscription{totalInscriptions > 1 ? 's' : ''} sur la période
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 7, height: 150 }}>
            {stats.chart.map((b, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
                <div
                  title={`${b.n} inscription${b.n > 1 ? 's' : ''}`}
                  style={{
                    width: '100%', borderRadius: '6px 6px 0 0',
                    background: b.n > 0 ? 'var(--brand)' : 'var(--field)',
                    height: `${Math.max(3, (b.n / maxChart) * 100)}%`,
                  }}
                />
                <span style={{ fontSize: 9, color: 'var(--muted)' }}>{b.d}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="acard" style={{ padding: 20 }}>
          <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 16, marginBottom: 14 }}>À traiter</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {queues.map((qu) => (
              <button
                key={qu.label}
                type="button"
                onClick={() => navigate(qu.to)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 13, borderRadius: 13, background: 'var(--field)', textAlign: 'left', width: '100%' }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 10, background: qu.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ion-icon name={qu.icon} style={{ fontSize: 18, color: qu.tint }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700 }}>{qu.label}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{qu.sub}</div>
                </div>
                <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 18, color: qu.tint }}>{qu.n}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
