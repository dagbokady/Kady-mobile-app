import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiError } from '../api'
import { useAdminAuth } from '../AdminAuth'

export default function Login() {
  const { login } = useAdminAuth()
  const navigate = useNavigate()
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(token.trim())
      navigate('/')
    } catch (err) {
      setError(apiError(err) || 'Jeton admin invalide.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-screen">
      <form className="login-card" onSubmit={onSubmit}>
        <div className="sidebar-brand" style={{ padding: 0, fontSize: 22 }}>
          KADY Admin
        </div>
        <p style={{ color: 'var(--muted)', fontSize: 14, margin: 0 }}>
          Entre le jeton d'administration (ADMIN_TOKEN) pour accéder au back-office.
        </p>
        {error && <div className="error-banner">{error}</div>}
        <input
          className="input"
          type="password"
          placeholder="X-Admin-Token"
          required
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Vérification…' : 'Entrer'}
        </button>
      </form>
    </div>
  )
}
