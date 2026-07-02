import { useEffect, useState } from 'react'
import { admin, apiError, type Stats } from '../api'

const labels: Record<keyof Stats, string> = {
  users: 'Utilisateurs',
  actifs: 'Actifs',
  cercles: 'Cercles actifs',
  premium: 'Premium',
  waitlist: "Liste d'attente",
  reports: 'Signalements ouverts',
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    admin.stats().then(setStats).catch((err) => setError(apiError(err)))
  }, [])

  return (
    <div>
      <div className="admin-title">Tableau de bord</div>
      <p className="admin-subtitle">Vue d'ensemble de la plateforme KADY.</p>
      {error && <div className="error-banner">{error}</div>}
      {stats && (
        <div className="stat-grid">
          {(Object.keys(labels) as (keyof Stats)[]).map((key) => (
            <div key={key} className="stat-card">
              <div className="stat-value">{stats[key]}</div>
              <div className="stat-label">{labels[key]}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
