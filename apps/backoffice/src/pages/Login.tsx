import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiError } from '../api'
import { useAdminAuth } from '../AdminAuth'
import Logo from '../components/Logo'
import Wordmark from '../components/Wordmark'

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <Logo size={26} />
          <div>
            <Wordmark height={13} color="var(--text)" />
            <div style={{ fontSize: 10, letterSpacing: 2, color: 'var(--muted)', marginTop: 2 }}>ADMIN</div>
          </div>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: 14, margin: 0 }}>
          Entre le jeton d'administration (ADMIN_TOKEN) pour accéder au back-office.
        </p>
        {error && <div className="error-banner" style={{ marginBottom: 0 }}>{error}</div>}
        <div className="login-input">
          <ion-icon name="key-outline" style={{ fontSize: 17, color: 'var(--muted)' }} />
          <input
            className="kin"
            style={{ fontSize: 14 }}
            type="password"
            placeholder="X-Admin-Token"
            required
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </div>
        <button className="btn btn-brand" type="submit" disabled={loading} style={{ padding: 13 }}>
          {loading ? 'Vérification…' : 'Entrer'}
        </button>
      </form>
    </div>
  )
}
