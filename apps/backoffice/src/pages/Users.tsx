import { useEffect, useState } from 'react'
import { type AdminUser, admin, apiError } from '../api'

export default function Users() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [q, setQ] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  async function load(query?: string) {
    setLoading(true)
    setError('')
    try {
      setUsers(await admin.users(query || undefined))
    } catch (err) {
      setError(apiError(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function toggleSuspend(userId: string) {
    try {
      const { is_active } = await admin.suspend(userId)
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, is_active, status: is_active ? 'Actif' : 'Suspendu' } : u)))
    } catch (err) {
      setError(apiError(err))
    }
  }

  function badgeClass(status: string) {
    if (status === 'Suspendu') return 'badge badge-danger'
    if (status === 'Premium') return 'badge badge-ok'
    if (status === 'Vérifié') return 'badge badge-ok'
    return 'badge badge-warn'
  }

  return (
    <div>
      <div className="admin-title">Utilisateurs</div>
      <p className="admin-subtitle">Gère les comptes de la plateforme.</p>
      <div className="toolbar">
        <input
          className="input"
          placeholder="Rechercher par nom ou email…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && load(q)}
          style={{ minWidth: 280 }}
        />
        <button className="btn btn-ghost" type="button" onClick={() => load(q)}>
          Chercher
        </button>
      </div>
      {error && <div className="error-banner">{error}</div>}
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Ville</th>
              <th>Cercles</th>
              <th>Inscrit le</th>
              <th>Statut</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="empty">
                  Chargement…
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty">
                  Aucun utilisateur.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.ville ?? '—'}</td>
                  <td>{u.cercles}</td>
                  <td>{u.joined}</td>
                  <td>
                    <span className={badgeClass(u.status)}>{u.status}</span>
                  </td>
                  <td>
                    <button
                      className={u.is_active ? 'btn btn-danger' : 'btn btn-ghost'}
                      type="button"
                      onClick={() => toggleSuspend(u.id)}
                    >
                      {u.is_active ? 'Suspendre' : 'Réactiver'}
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
