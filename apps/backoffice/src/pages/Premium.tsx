import { useEffect, useState } from 'react'
import { type AdminPremium, admin, apiError } from '../api'
import { fmtFcfa, fmtNombre } from '../visuals'

export default function Premium() {
  const [data, setData] = useState<AdminPremium | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    admin.premium().then(setData).catch((err) => setError(apiError(err)))
  }, [])

  if (error) return <div className="error-banner">{error}</div>
  if (!data) return <div className="empty-state">Chargement…</div>

  const kpis = [
    { label: 'Revenu mensuel (MRR)', val: fmtFcfa(data.mrr), delta: data.delta ? `${data.delta} sur 30 j` : null },
    { label: 'Abonnés actifs', val: fmtNombre(data.abonnes), delta: `${data.nouveaux_30j} nouveau${data.nouveaux_30j > 1 ? 'x' : ''} / 30 j` },
    { label: 'Taux de conversion', val: `${data.conversion.toLocaleString('fr-FR')}%`, delta: `abonnement à ${fmtFcfa(data.prix)}/mois` },
  ]

  return (
    <div style={{ animation: 'kf .3s ease' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
        {kpis.map((k) => (
          <div key={k.label} className="acard" style={{ padding: 18 }}>
            <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{k.label}</div>
            <div style={{ marginTop: 8, fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 25 }}>{k.val}</div>
            {k.delta && <div style={{ marginTop: 3, fontSize: 12, fontWeight: 700, color: '#1f9d57' }}>{k.delta}</div>}
          </div>
        ))}
      </div>

      <div className="acard" style={{ marginTop: 18, padding: 20 }}>
        <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 16, marginBottom: 14 }}>Abonnés par formule</div>
        {data.plans.map((p) => (
          <div key={p.label} style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, marginBottom: 6 }}>
              <span style={{ fontWeight: 700 }}>{p.label}</span>
              <span style={{ color: 'var(--muted)' }}>
                {fmtNombre(p.count)} abonné{p.count > 1 ? 's' : ''} · {p.pct}%
              </span>
            </div>
            <div style={{ height: 9, borderRadius: 99, background: 'var(--field)', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'var(--brand)', width: `${p.pct}%` }} />
            </div>
          </div>
        ))}
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>
          Paiement mobile money via CinetPay (Orange, Wave, MTN, Moov) — la formule annuelle arrivera avec la V2.
        </div>
      </div>
    </div>
  )
}
