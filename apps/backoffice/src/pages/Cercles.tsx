import { useEffect, useState } from 'react'
import { type AdminCercle, admin, apiError } from '../api'

export default function Cercles() {
  const [cercles, setCercles] = useState<AdminCercle[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    admin
      .cercles()
      .then(setCercles)
      .catch((err) => setError(apiError(err)))
      .finally(() => setLoading(false))
  }, [])

  async function toggle(id: string) {
    try {
      const { statut } = await admin.toggleCercle(id)
      setCercles((prev) => prev.map((c) => (c.id === id ? { ...c, statut } : c)))
    } catch (err) {
      setError(apiError(err))
    }
  }

  return (
    <div>
      <div className="admin-title">Cercles</div>
      <p className="admin-subtitle">Active ou archive les Cercles de la plateforme.</p>
      {error && <div className="error-banner">{error}</div>}
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Thème</th>
              <th>Membres</th>
              <th>Statut</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="empty">
                  Chargement…
                </td>
              </tr>
            ) : cercles.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty">
                  Aucun Cercle.
                </td>
              </tr>
            ) : (
              cercles.map((c) => (
                <tr key={c.id}>
                  <td>{c.nom}</td>
                  <td>{c.theme ?? '—'}</td>
                  <td>{c.membres}</td>
                  <td>
                    <span className={c.statut === 'actif' ? 'badge badge-ok' : 'badge badge-warn'}>{c.statut}</span>
                  </td>
                  <td>
                    <button className="btn btn-ghost" type="button" onClick={() => toggle(c.id)}>
                      {c.statut === 'actif' ? 'Archiver' : 'Réactiver'}
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
