import { useEffect, useState } from 'react'
import { type AppConfigState, type ConfigKey, admin, apiError } from '../api'
import { toast } from '../toast'

export default function Reglages() {
  const [config, setConfig] = useState<AppConfigState | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    admin.getConfig().then(setConfig).catch((err) => setError(apiError(err)))
  }, [])

  async function basculer(cle: ConfigKey, valeur: boolean, label: string) {
    if (!config) return
    const avant = config
    setConfig({ ...config, [cle]: valeur })
    try {
      await admin.setConfig(cle, valeur)
      toast(`${label} ${valeur ? 'activé' : 'désactivé'}`)
    } catch (err) {
      setConfig(avant)
      toast(apiError(err))
    }
  }

  if (error) return <div className="error-banner">{error}</div>
  if (!config) return <div className="empty-state">Chargement…</div>

  const rows: Array<{ icon: string; label: string; sub: string; on: boolean; onToggle: () => void }> = [
    {
      icon: 'globe',
      label: 'Inscriptions ouvertes',
      sub: config.waitlist_mode
        ? `Waitlist active · ${config.waitlist_count} inscrit${config.waitlist_count > 1 ? 's' : ''} en attente`
        : 'Nouvelles inscriptions autorisées',
      on: !config.waitlist_mode,
      onToggle: () => basculer('waitlist_mode', config.waitlist_mode ? false : true, 'Mode waitlist'),
    },
    {
      icon: 'flash',
      label: 'Vérification auto (IA)',
      sub: 'Pré-valider les selfies automatiquement',
      on: config.auto_verif,
      onToggle: () => basculer('auto_verif', !config.auto_verif, 'Vérification auto'),
    },
    {
      icon: 'pricetag',
      label: 'Promo Premium active',
      sub: 'Met en avant l’offre Premium dans l’app',
      on: config.premium_promo,
      onToggle: () => basculer('premium_promo', !config.premium_promo, 'Promo Premium'),
    },
    {
      icon: 'construct',
      label: 'Mode maintenance',
      sub: 'Coupe l’accès à l’app mobile et web',
      on: config.maintenance,
      onToggle: () => basculer('maintenance', !config.maintenance, 'Mode maintenance'),
    },
  ]

  return (
    <div style={{ animation: 'kf .3s ease', maxWidth: 640 }}>
      {rows.map((s) => (
        <div key={s.label} className="acard" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, borderRadius: 16, marginBottom: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: 'var(--field)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ion-icon name={s.icon} style={{ fontSize: 19, color: 'var(--accent)' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{s.label}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{s.sub}</div>
          </div>
          <button type="button" className={`toggle${s.on ? ' on' : ''}`} onClick={s.onToggle} aria-label={s.label}>
            <div className="toggle-knob" />
          </button>
        </div>
      ))}
    </div>
  )
}
