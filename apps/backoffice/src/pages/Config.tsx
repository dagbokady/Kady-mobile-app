import { useEffect, useState } from 'react'
import { type AppConfigState, admin, apiError } from '../api'

export default function Config() {
  const [config, setConfig] = useState<AppConfigState | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    admin.getConfig().then(setConfig).catch((err) => setError(apiError(err)))
  }, [])

  async function toggle(cle: keyof AppConfigState) {
    if (!config) return
    const valeur = !config[cle]
    setConfig({ ...config, [cle]: valeur })
    try {
      await admin.setConfig(cle, valeur)
    } catch (err) {
      setError(apiError(err))
      setConfig(config)
    }
  }

  return (
    <div>
      <div className="admin-title">Configuration</div>
      <p className="admin-subtitle">Réglages globaux de la plateforme, appliqués en temps réel.</p>
      {error && <div className="error-banner">{error}</div>}
      {config && (
        <div className="table-card" style={{ padding: 20 }}>
          <div className="toolbar" style={{ marginBottom: 20 }}>
            <div>
              <strong>Mode liste d'attente</strong>
              <p className="admin-subtitle" style={{ margin: '2px 0 0' }}>
                Les nouvelles inscriptions passent par la liste d'attente.
              </p>
            </div>
            <button
              type="button"
              className={`toggle${config.waitlist_mode ? ' on' : ''}`}
              onClick={() => toggle('waitlist_mode')}
              aria-label="Mode liste d'attente"
            />
          </div>
          <div className="toolbar" style={{ marginBottom: 0 }}>
            <div>
              <strong>Mode maintenance</strong>
              <p className="admin-subtitle" style={{ margin: '2px 0 0' }}>
                Coupe l'accès à l'application pour tous les utilisateurs.
              </p>
            </div>
            <button
              type="button"
              className={`toggle${config.maintenance ? ' on' : ''}`}
              onClick={() => toggle('maintenance')}
              aria-label="Mode maintenance"
            />
          </div>
        </div>
      )}
    </div>
  )
}
