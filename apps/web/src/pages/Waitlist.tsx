import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { site } from '../api'
import { apiError } from '../api/client'
import Logo from '../components/Logo'
import Wordmark from '../components/Wordmark'

export default function Waitlist() {
  const navigate = useNavigate()
  const [prenom, setPrenom] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [rang, setRang] = useState<number | null | undefined>(undefined)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await site.rejoindreWaitlist({ prenom: prenom.trim(), email: email.trim() })
      setRang(res.rang)
    } catch (err) {
      setError(apiError(err))
    } finally {
      setLoading(false)
    }
  }

  const inscrit = rang !== undefined

  return (
    <div className="splash">
      <div className="splash-aura splash-aura-1" />
      <div className="splash-aura splash-aura-2" />
      <div className="splash-inner">
        <Logo size={80} glow />
        <div style={{ marginTop: 22 }}>
          <Wordmark height={38} />
        </div>
        <div style={{ marginTop: 10, fontSize: 12.5, fontWeight: 600, letterSpacing: 4, color: '#ef8fbb' }}>
          BIENTÔT DISPONIBLE
        </div>

        {inscrit ? (
          <>
            <div className="splash-tagline" style={{ marginTop: 22 }}>Vous êtes sur la liste 🎉</div>
            <p className="splash-desc">
              {rang
                ? `Vous êtes en position ${rang} sur la liste d'attente. Nous vous préviendrons par e-mail dès l'ouverture.`
                : `C'est noté ! Nous vous préviendrons par e-mail dès l'ouverture.`}
            </p>
          </>
        ) : (
          <>
            <div className="splash-tagline" style={{ marginTop: 22 }}>Les inscriptions ouvrent bientôt.</div>
            <p className="splash-desc">
              KADY se lance en douceur. Laissez votre e-mail pour être prévenu·e en priorité dès que les portes s'ouvrent.
            </p>
            <form onSubmit={onSubmit} style={{ width: 300, maxWidth: '90vw', marginTop: 26, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {error && <div className="error-banner">{error}</div>}
              <div className="field-box">
                <ion-icon name="person-outline" />
                <input
                  className="input"
                  type="text"
                  required
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  placeholder="Votre prénom"
                />
              </div>
              <div className="field-box">
                <ion-icon name="mail-outline" />
                <input
                  className="input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="toi@email.com"
                />
              </div>
              <button className="splash-cta" type="submit" disabled={loading} style={{ width: '100%' }}>
                {loading ? 'Un instant…' : 'Rejoindre la liste'}
                {!loading && <ion-icon name="arrow-forward" style={{ fontSize: 18 }} />}
              </button>
            </form>
          </>
        )}

        <button
          type="button"
          onClick={() => navigate('/login')}
          style={{ marginTop: 20, fontSize: 13, color: 'rgba(255,255,255,.62)' }}
        >
          Déjà un compte ? Se connecter
        </button>
      </div>
    </div>
  )
}
