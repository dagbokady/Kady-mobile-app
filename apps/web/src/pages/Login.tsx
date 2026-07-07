import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiError } from '../api/client'
import { useAuth } from '../store/auth'
import { toast } from '../store/toast'
import Logo from '../components/Logo'
import Wordmark from '../components/Wordmark'

export default function Login() {
  const login = useAuth((s) => s.login)
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(apiError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ksplit">
      <div className="ksplit-art split-art">
        <div className="row" style={{ gap: 11, position: 'relative' }}>
          <Logo size={24} />
          <Wordmark height={14} color="#fff" />
        </div>
        <div style={{ position: 'relative' }}>
          <div className="split-headline">Les vraies rencontres commencent dans un cercle.</div>
          <div className="split-sub">Retrouve tes cercles, tes conversations et les liens que tu construis, à ton rythme.</div>
        </div>
        <div className="split-badge">
          <div
            style={{
              width: 46, height: 46, borderRadius: 14, background: 'linear-gradient(135deg,#ff9d5c,#d34d7e)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            <ion-icon name="people" style={{ fontSize: 22, color: '#fff' }} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>+12 000 cercles actifs</div>
            <div style={{ marginTop: 2, fontSize: 12.5, color: 'rgba(255,255,255,.72)' }}>
              à Abidjan et partout en Côte d'Ivoire
            </div>
          </div>
        </div>
      </div>

      <div className="split-form">
        <form className="split-form-inner" onSubmit={onSubmit}>
          <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 30 }}>Content de te revoir</div>
          <div className="subtitle" style={{ marginTop: 6 }}>Connecte-toi pour retrouver tes cercles.</div>

          {error && (
            <div className="error-banner" style={{ marginTop: 18 }}>
              <ion-icon name="alert-circle" />
              {error}
            </div>
          )}

          <div style={{ marginTop: 26, fontSize: 12.5, fontWeight: 700 }}>Email</div>
          <div className="field-box" style={{ marginTop: 8 }}>
            <ion-icon name="mail-outline" style={{ fontSize: 18 }} />
            <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="toi@email.com" />
          </div>

          <div className="row between" style={{ marginTop: 16 }}>
            <span style={{ fontSize: 12.5, fontWeight: 700 }}>Mot de passe</span>
            <button
              type="button"
              className="link"
              style={{ fontSize: 12, fontWeight: 600 }}
              onClick={() => toast('Réinitialisation par email — bientôt disponible')}
            >
              Oublié ?
            </button>
          </div>
          <div className="field-box" style={{ marginTop: 8 }}>
            <ion-icon name="lock-closed-outline" style={{ fontSize: 18 }} />
            <input className="input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', marginTop: 24, padding: 15 }}>
            {loading ? 'Connexion…' : 'Se connecter'}
            <ion-icon name="arrow-forward" style={{ fontSize: 17 }} />
          </button>

          <div style={{ margin: '22px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: 12, color: 'rgba(var(--ink),.4)' }}>ou continuer avec</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>
          <div className="row" style={{ gap: 12 }}>
            <button
              type="button"
              className="btn btn-card"
              style={{ flex: 1, padding: 13, borderRadius: 13, fontSize: 13.5, boxShadow: 'none' }}
              onClick={() => toast('Connexion Google — bientôt disponible')}
            >
              <ion-icon name="logo-google" style={{ fontSize: 18, color: '#ea4335' }} />
              Google
            </button>
            <button
              type="button"
              className="btn btn-card"
              style={{ flex: 1, padding: 13, borderRadius: 13, fontSize: 13.5, boxShadow: 'none' }}
              onClick={() => toast('Connexion Apple — bientôt disponible')}
            >
              <ion-icon name="logo-apple" style={{ fontSize: 19 }} />
              Apple
            </button>
          </div>

          <p className="subtitle" style={{ textAlign: 'center', marginTop: 24, fontSize: 13.5 }}>
            Pas encore de compte ? <Link className="link" to="/inscription">Crée-en un</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
