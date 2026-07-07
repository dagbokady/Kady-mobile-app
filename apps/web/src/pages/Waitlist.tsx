import { type FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { site, type WaitlistStatut } from '../api'
import { apiError } from '../api/client'
import { toast } from '../store/toast'
import Logo from '../components/Logo'
import Wordmark from '../components/Wordmark'

// Catégories de Cercles proposées au vote des futurs membres.
const CATEGORIES = ['Voyage', 'Entrepreneuriat', 'Cinéma', 'Foi', 'Sport', 'Art', 'Cuisine', 'Musique']

interface WaitlistLocal {
  prenom: string
  email: string
  genre?: string
  categories?: string[]
  code?: string
}

function lireLocal(): WaitlistLocal | null {
  try {
    return JSON.parse(localStorage.getItem('kady.waitlist') ?? 'null')
  } catch {
    return null
  }
}

export default function Waitlist() {
  const navigate = useNavigate()
  const [prenom, setPrenom] = useState('')
  const [email, setEmail] = useState('')
  const [genre, setGenre] = useState('')
  const [categories, setCategories] = useState<string[]>([])
  const [codeParrain, setCodeParrain] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [statut, setStatut] = useState<WaitlistStatut | null>(null)

  // Retour sur le site : déjà inscrit·e → afficher directement sa place (pas de re-inscription).
  useEffect(() => {
    const local = lireLocal()
    if (local?.email) {
      site.statutWaitlist(local.email).then(setStatut).catch(() => {})
    }
  }, [])

  function toggleCategorie(c: string) {
    setCategories((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]))
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!genre) return setError('Indique ton genre.')
    if (categories.length === 0) return setError('Choisis au moins une catégorie de cercles.')
    setLoading(true)
    try {
      const res = await site.rejoindreWaitlist({
        prenom: prenom.trim(),
        email: email.trim().toLowerCase(),
        genre,
        centres_interet: categories,
        parraine_par: codeParrain.trim() || undefined,
      })
      setStatut(res)
      // Mémorisé pour le retour ET pour préremplir l'inscription à l'ouverture.
      localStorage.setItem('kady.waitlist', JSON.stringify({
        prenom: prenom.trim(), email: email.trim().toLowerCase(), genre, categories, code: res.code_parrainage,
      } satisfies WaitlistLocal))
    } catch (err) {
      setError(apiError(err))
    } finally {
      setLoading(false)
    }
  }

  function copierCode() {
    if (!statut) return
    navigator.clipboard?.writeText(statut.code_parrainage).then(
      () => toast('Code copié ✓ Partage-le pour monter dans la file !'),
      () => toast(statut.code_parrainage),
    )
  }

  return (
    <div className="splash">
      <div className="splash-aura splash-aura-1" />
      <div className="splash-aura splash-aura-2" />
      <div className="splash-inner" style={{ maxWidth: 680 }}>
        <Logo size={72} glow />
        <div style={{ marginTop: 18 }}>
          <Wordmark height={34} />
        </div>
        <div style={{ marginTop: 10, fontSize: 12.5, fontWeight: 600, letterSpacing: 4, color: '#ef8fbb' }}>
          BIENTÔT DISPONIBLE
        </div>

        {statut ? (
          <>
            <div className="splash-tagline" style={{ marginTop: 20 }}>
              {statut.prenom ? `${statut.prenom}, tu es` : 'Tu es'} sur la liste 🎉
            </div>
            <div
              style={{
                marginTop: 18, padding: '18px 26px', borderRadius: 18, background: 'rgba(255,255,255,.08)',
                border: '1px solid rgba(255,255,255,.2)', backdropFilter: 'blur(8px)',
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 2, color: 'rgba(255,255,255,.6)' }}>TA POSITION</div>
              <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 44, color: '#fff' }}>
                {statut.rang ? `#${statut.rang}` : '—'}
              </div>
              <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,.65)' }}>
                {statut.nb_parrainages} invitation{statut.nb_parrainages > 1 ? 's' : ''} utilisée{statut.nb_parrainages > 1 ? 's' : ''}
              </div>
            </div>

            <div style={{ marginTop: 20, fontSize: 14, color: 'rgba(255,255,255,.85)', fontWeight: 600 }}>
              Ton code d'invitation
            </div>
            <button
              type="button"
              onClick={copierCode}
              style={{
                marginTop: 8, display: 'flex', alignItems: 'center', gap: 10, padding: '13px 22px', borderRadius: 14,
                background: 'rgba(255,255,255,.12)', border: '1.5px dashed rgba(255,255,255,.4)', cursor: 'pointer',
              }}
            >
              <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 20, letterSpacing: 2, color: '#fff' }}>
                {statut.code_parrainage}
              </span>
              <ion-icon name="copy-outline" style={{ fontSize: 18, color: 'rgba(255,255,255,.7)' }} />
            </button>
            <p className="splash-desc" style={{ marginTop: 14, maxWidth: 440 }}>
              Chaque personne qui s'inscrit avec ton code te fait monter dans la file.
              {statut.genre === 'femme' ? ' Et pour toi, chaque invitation compte double ✨' : ' Les invitations des femmes comptent double.'}
            </p>
          </>
        ) : (
          <>
            <div className="splash-tagline" style={{ marginTop: 20 }}>Les inscriptions ouvrent bientôt.</div>
            <p className="splash-desc" style={{ marginTop: 10 }}>
              Réserve ta place, dis-nous quels cercles tu veux voir naître, et fais monter ton rang en invitant tes amis.
            </p>
            <form onSubmit={onSubmit} style={{ width: 420, maxWidth: '92vw', marginTop: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {error && <div className="error-banner">{error}</div>}
              <div className="row" style={{ gap: 10 }}>
                <div className="field-box" style={{ flex: 1 }}>
                  <ion-icon name="person-outline" />
                  <input className="input" type="text" required value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="Ton prénom" />
                </div>
                <div className="field-box" style={{ flex: 1.4 }}>
                  <ion-icon name="mail-outline" />
                  <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="toi@email.com" />
                </div>
              </div>

              <div className="row" style={{ gap: 10 }}>
                {[
                  { v: 'femme', l: 'Femme' },
                  { v: 'homme', l: 'Homme' },
                ].map((g) => (
                  <button
                    key={g.v}
                    type="button"
                    onClick={() => setGenre(g.v)}
                    style={{
                      flex: 1, padding: '11px 0', borderRadius: 13, fontSize: 14, fontWeight: 700, cursor: 'pointer',
                      border: `1.5px solid ${genre === g.v ? '#ff8fbc' : 'rgba(255,255,255,.28)'}`,
                      background: genre === g.v ? 'rgba(255,143,188,.2)' : 'rgba(255,255,255,.08)', color: '#fff',
                    }}
                  >
                    {g.l}
                  </button>
                ))}
              </div>

              <div style={{ textAlign: 'left', fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,.75)', marginTop: 4 }}>
                Quels cercles veux-tu voir naître ?
              </div>
              <div className="row" style={{ flexWrap: 'wrap', gap: 8 }}>
                {CATEGORIES.map((c) => {
                  const on = categories.includes(c)
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleCategorie(c)}
                      style={{
                        padding: '8px 14px', borderRadius: 99, fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                        border: `1.5px solid ${on ? '#ff8fbc' : 'rgba(255,255,255,.28)'}`,
                        background: on ? 'rgba(255,143,188,.2)' : 'rgba(255,255,255,.06)', color: '#fff',
                      }}
                    >
                      {c}
                    </button>
                  )
                })}
              </div>

              <div className="field-box" style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.22)' }}>
                <ion-icon name="gift-outline" style={{ color: 'rgba(255,255,255,.6)' }} />
                <input
                  className="input"
                  style={{ color: '#fff' }}
                  type="text"
                  value={codeParrain}
                  onChange={(e) => setCodeParrain(e.target.value.toUpperCase())}
                  placeholder="Code d'invitation (facultatif)"
                />
              </div>

              <button className="splash-cta" type="submit" disabled={loading} style={{ width: '100%' }}>
                {loading ? 'Un instant…' : 'Réserver ma place'}
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
