import { useEffect, useState } from 'react'
import { type AdminSignalement, admin, apiError } from '../api'

export default function Signalements() {
  const [items, setItems] = useState<AdminSignalement[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    admin
      .signalements()
      .then(setItems)
      .catch((err) => setError(apiError(err)))
      .finally(() => setLoading(false))
  }, [])

  async function resolve(id: string, statut: 'traite' | 'rejete') {
    try {
      await admin.resolveSignalement(id, statut)
      setItems((prev) => prev.filter((s) => s.id !== id))
    } catch (err) {
      setError(apiError(err))
    }
  }

  return (
    <div>
      <div className="admin-title">Signalements</div>
      <p className="admin-subtitle">Signalements ouverts en attente de modération.</p>
      {error && <div className="error-banner">{error}</div>}
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Contexte</th>
              <th>Motif</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="empty">
                  Chargement…
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={4} className="empty">
                  Aucun signalement ouvert.
                </td>
              </tr>
            ) : (
              items.map((s) => (
                <tr key={s.id}>
                  <td>
                    <span className="badge badge-warn">{s.contexte}</span>
                  </td>
                  <td>{s.motif ?? '—'}</td>
                  <td>{s.time}</td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-primary" type="button" onClick={() => resolve(s.id, 'traite')}>
                      Traiter
                    </button>
                    <button className="btn btn-danger" type="button" onClick={() => resolve(s.id, 'rejete')}>
                      Rejeter
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
