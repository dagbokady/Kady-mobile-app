import { useEffect, useState } from 'react'
import { type AppConfigState, type ConfigKey, type SiteMode, admin, apiError } from '../api'
import { toast } from '../toast'

const MODES: Array<{ value: SiteMode; icon: string; label: string; sub: string }> = [
  { value: 'open', icon: 'globe', label: 'Ouvert', sub: 'Site accessible, inscriptions autorisées' },
  { value: 'waitlist', icon: 'hourglass', label: 'Waitlist', sub: 'Pré-lancement : gate liste d’attente, connexion possible' },
  { value: 'maintenance', icon: 'construct', label: 'Maintenance', sub: 'Accès coupé pour tous les visiteurs' },
]

export default function Reglages() {
  const [config, setConfig] = useState<AppConfigState | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    admin.getConfig().then(setConfig).catch((err) => setError(apiError(err)))
  }, [])

  async function changerMode(mode: SiteMode) {
    if (!config || config.mode === mode) return
    const avant = config
    setConfig({ ...config, mode, maintenance: mode === 'maintenance', waitlist_mode: mode === 'waitlist' })
    try {
      await admin.setMode(mode)
      toast(`Mode « ${MODES.find((m) => m.value === mode)?.label} » activé`)
    } catch (err) {
      setConfig(avant)
      toast(apiError(err))
    }
  }

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

  const toggles: Array<{ icon: string; label: string; sub: string; on: boolean; onToggle: () => void }> = [
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
  ]

  return (
    <div style={{ animation: 'kf .3s ease', maxWidth: 640 }}>
      <div className="acard" style={{ padding: 18, borderRadius: 16, marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700 }}>Mode du site</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
          Pilote ce que voient les visiteurs de la web
          {config.waitlist_mode && ` · ${config.waitlist_count} inscrit${config.waitlist_count > 1 ? 's' : ''} en attente`}
        </div>
        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {MODES.map((m) => {
            const actif = config.mode === m.value
            return (
              <button
                key={m.value}
                type="button"
                onClick={() => changerMode(m.value)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 13, padding: 14, borderRadius: 13, textAlign: 'left',
                  width: '100%', cursor: 'pointer',
                  background: 'var(--field)',
                  border: `1.5px solid ${actif ? 'var(--accent)' : 'var(--border)'}`,
                }}
              >
                <div style={{ width: 38, height: 38, borderRadius: 11, background: 'var(--card)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ion-icon name={m.icon} style={{ fontSize: 18, color: actif ? 'var(--accent)' : 'var(--muted)' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700 }}>{m.label}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>{m.sub}</div>
                </div>
                <div
                  style={{
                    width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                    border: `2px solid ${actif ? 'var(--accent)' : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {actif && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent)' }} />}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {toggles.map((s) => (
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
