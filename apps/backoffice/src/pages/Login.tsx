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
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="34" height="22" viewBox="0 0 132 82" fill="none">
            <defs>
              <linearGradient id="klog" x1="14" y1="6" x2="120" y2="78" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#ffc2d6" />
                <stop offset=".5" stopColor="#ff5f9e" />
                <stop offset="1" stopColor="#bb1659" />
              </linearGradient>
            </defs>
            <circle cx="86" cy="41" r="27" stroke="url(#klog)" strokeWidth="13.5" />
            <circle cx="46" cy="41" r="27" stroke="url(#klog)" strokeWidth="13.5" />
            <path d="M66 58.9 A27 27 0 0 0 80 66.4" stroke="url(#klog)" strokeWidth="13.5" strokeLinecap="round" />
          </svg>
          <div>
            <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 18, letterSpacing: 3 }}>KADY</div>
            <div style={{ fontSize: 10, letterSpacing: 2, color: 'var(--muted)' }}>ADMIN</div>
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
