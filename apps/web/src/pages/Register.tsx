import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { meta } from '../api'
import { apiError } from '../api/client'
import { useAuth } from '../store/auth'
import { toast } from '../store/toast'
import Logo from '../components/Logo'
import Wordmark from '../components/Wordmark'
import LegalModal from '../components/LegalModal'
import { CONDITIONS, CONFIDENTIALITE } from '../legal'

const POINTS = [
  { icon: 'shield-checkmark', text: 'Profils vérifiés par selfie vivant' },
  { icon: 'lock-closed', text: 'Aucun message sans cercle partagé' },
  { icon: 'trending-up', text: 'La confiance se construit par niveaux' },
]

const INTERETS = ['Musique', 'Sport', 'Cuisine', 'Cinéma', 'Voyage', 'Lecture', 'Mode', 'Tech', 'Foi', 'Entrepreneuriat', 'Danse', 'Jeux vidéo']

const PHOTO_LABELS = ['Principale', 'Photo 2', 'Photo 3', 'Photo 4', 'Photo 5', 'Photo 6']

// Écart d'âge accepté autour de son propre âge (le minimum reste toujours 18 ans).
const ECARTS = [
  { v: 3, l: '±3 ans' },
  { v: 5, l: '±5 ans' },
  { v: 10, l: '±10 ans' },
  { v: 15, l: '±15 ans' },
  { v: 0, l: 'Peu importe' },
]

/** Infos laissées par l'inscription à la liste d'attente (préremplissage à l'ouverture). */
function lireWaitlist(): { prenom?: string; email?: string; genre?: string; categories?: string[] } | null {
  try {
    return JSON.parse(localStorage.getItem('kady.waitlist') ?? 'null')
  } catch {
    return null
  }
}

function calcAge(dob: string): number | null {
  const m = dob.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!m) return null
  const b = new Date(+m[3], +m[2] - 1, +m[1])
  if (Number.isNaN(b.getTime())) return null
  return Math.floor((Date.now() - b.getTime()) / (365.25 * 24 * 3600 * 1000))
}

function dobToIso(dob: string): string {
  const m = dob.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  return m ? `${m[3]}-${m[2]}-${m[1]}` : dob
}

export default function Register() {
  const register = useAuth((s) => s.register)
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [villes, setVilles] = useState<string[]>([])

  // Préremplissage depuis la liste d'attente (transition waitlist → ouverture).
  const [wl] = useState(lireWaitlist)

  // Étape 0 — essentiels
  const [prenom, setPrenom] = useState(wl?.prenom ?? '')
  const [email, setEmail] = useState(wl?.email ?? '')
  const [telephone, setTelephone] = useState('')
  const [mdp, setMdp] = useState('')
  const [mdp2, setMdp2] = useState('')
  const [dob, setDob] = useState('')

  // Étape 1 — genre, mode, écart d'âge, ville
  const [genre, setGenre] = useState(wl?.genre === 'femme' || wl?.genre === 'homme' ? wl.genre : '')
  const [mode, setMode] = useState<'rencontre' | 'amitie'>('rencontre')
  const [ecart, setEcart] = useState(5)
  const [ville, setVille] = useState('')

  // Étape 2 — intérêts
  const [interets, setInterets] = useState<string[]>(
    () => (wl?.categories ?? []).filter((c) => INTERETS.includes(c)),
  )

  // Étape 3 — selfie de vérification (caméra uniquement, jamais d'upload)
  const [selfie, setSelfie] = useState<string | null>(null)
  const [cameraOn, setCameraOn] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Étape 4 — photos (6 emplacements ; la 1re devient la photo de profil)
  const [photos, setPhotos] = useState<Array<string | null>>([null, null, null, null, null, null])
  const filePhotoRef = useRef<HTMLInputElement>(null)
  const photoSlotRef = useRef(0)

  // Étape 5 — CGU : lecture obligatoire des deux documents avant de cocher
  const [cgu, setCgu] = useState(false)
  const [luConditions, setLuConditions] = useState(false)
  const [luConfidentialite, setLuConfidentialite] = useState(false)
  const [docOuvert, setDocOuvert] = useState<'cgu' | 'confidentialite' | null>(null)
  const docsLus = luConditions && luConfidentialite

  useEffect(() => {
    meta.villes().then(setVilles).catch(() => {})
  }, [])

  useEffect(() => () => stopCamera(), [])

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setCameraOn(false)
  }

  async function startCamera() {
    setError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
      streamRef.current = stream
      setCameraOn(true)
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play().catch(() => {})
        }
      })
    } catch {
      // Pas de repli fichier : le selfie de vérification doit venir de la caméra en direct.
      setError("Impossible d'accéder à la caméra. Autorise-la dans ton navigateur pour continuer.")
    }
  }

  function captureSelfie() {
    const video = videoRef.current
    if (!video) return
    const size = Math.min(video.videoWidth, video.videoHeight) || 480
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.translate(size, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(video, (video.videoWidth - size) / 2, (video.videoHeight - size) / 2, size, size, 0, 0, size, size)
    setSelfie(canvas.toDataURL('image/jpeg', 0.85))
    stopCamera()
    toast('Selfie capturé ✓ Vérification en cours…')
  }

  function pickPhoto(i: number) {
    photoSlotRef.current = i
    filePhotoRef.current?.click()
  }

  function onPhotoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () =>
      setPhotos((prev) => {
        const next = [...prev]
        next[photoSlotRef.current] = reader.result as string
        return next
      })
    reader.readAsDataURL(f)
    e.target.value = ''
  }

  function toggleInteret(i: string) {
    setInterets((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]))
  }

  function precedent() {
    setError('')
    if (step === 0) navigate('/bienvenue')
    else setStep((s) => s - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function suivant() {
    setError('')
    if (step === 0) {
      if (!prenom.trim()) return setError('Indique ton prénom.')
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setError('Email invalide.')
      const telNettoye = telephone.replace(/[\s\-.()]/g, '')
      if (!/^\+?\d{8,15}$/.test(telNettoye)) return setError('Numéro de téléphone invalide (ex. +225 07 08 09 10 11).')
      if (mdp.length < 8) return setError('Mot de passe : 8 caractères minimum.')
      if (mdp !== mdp2) return setError('Les mots de passe ne correspondent pas.')
      const age = calcAge(dob)
      if (age === null) return setError('Date au format JJ/MM/AAAA.')
      if (age < 18) return setError('KADY est réservé aux 18 ans et plus.')
    }
    if (step === 1 && !genre) return setError('Choisis ton genre.')
    if (step === 2 && interets.length < 3) return setError("Choisis au moins 3 centres d'intérêt.")
    if (step === 3 && !selfie) return setError('Prends un selfie de vérification.')
    if (step === 4 && !(photos[0] && photos[1])) return setError('Ajoute ta photo de profil et une deuxième photo.')
    if (step === 5) {
      if (!docsLus) return setError('Lis les conditions d’utilisation et la politique de confidentialité avant de continuer.')
      if (!cgu) return setError('Tu dois accepter les conditions.')
      setLoading(true)
      try {
        await register({
          email,
          telephone: telephone.replace(/[\s\-.()]/g, ''),
          password: mdp,
          prenom: prenom.trim(),
          date_naissance: dobToIso(dob),
          genre: genre === 'femme' || genre === 'homme' ? genre : undefined,
          ville: ville || undefined,
          centres_interet: interets,
        })
        // Préférences définies au wizard (écart d'âge définitif + mode recherché ; minimum légal 18 ans).
        localStorage.setItem('kady.pref_mode', mode)
        localStorage.setItem('kady.age_gap', String(ecart))
        localStorage.removeItem('kady.waitlist') // la transition waitlist → compte est terminée
        navigate('/onboarding')
      } catch (err) {
        setError(apiError(err))
      } finally {
        setLoading(false)
      }
      return
    }
    setStep((s) => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="ksplit">
      <div className="ksplit-art split-art">
        <div className="row" style={{ gap: 11, position: 'relative' }}>
          <Logo size={24} />
          <Wordmark height={14} color="#fff" />
        </div>
        <div style={{ position: 'relative' }}>
          <div className="split-headline" style={{ fontSize: 36, lineHeight: '44px' }}>Rejoins une communauté qui te ressemble.</div>
          <div className="stack" style={{ marginTop: 26, gap: 16 }}>
            {POINTS.map((p) => (
              <div key={p.text} className="row" style={{ gap: 13 }}>
                <div className="split-point-icon">
                  <ion-icon name={p.icon} style={{ fontSize: 19, color: '#fff' }} />
                </div>
                <span style={{ fontSize: 14.5, color: 'rgba(255,255,255,.85)' }}>{p.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: 'relative', fontSize: 13, color: 'rgba(255,255,255,.6)' }}>Réservé aux 18 ans et plus.</div>
      </div>

      <div className="kscroll" style={{ display: 'flex', flexDirection: 'column', padding: '40px 32px', background: 'var(--bg2)', overflowY: 'auto', maxHeight: '100vh' }}>
        <div style={{ width: '100%', maxWidth: 440, margin: '0 auto' }}>
          <div className="row" style={{ gap: 12 }}>
            <button className="icon-btn" type="button" onClick={precedent} aria-label="Retour" style={{ width: 40, height: 40, borderRadius: 12 }}>
              <ion-icon name="chevron-back" style={{ fontSize: 20 }} />
            </button>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(var(--ink),.5)' }}>Étape {step + 1} / 6</div>
              <div className="wizard-track">
                <div className="wizard-fill" style={{ width: `${((step + 1) / 6) * 100}%` }} />
              </div>
            </div>
          </div>

          <div key={step} style={{ marginTop: 26, animation: 'kfade .3s ease' }}>
            {step === 0 && (
              <>
                <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 26 }}>Crée ton compte</div>
                <div className="subtitle" style={{ marginTop: 5, fontSize: 14 }}>Commençons par les essentiels.</div>
                <div className="stack" style={{ marginTop: 22, gap: 15 }}>
                  <div className="field">
                    <label>Prénom</label>
                    <div className="field-box">
                      <ion-icon name="person-outline" />
                      <input className="input" value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="Didier" />
                    </div>
                  </div>
                  <div className="field">
                    <label>Email</label>
                    <div className="field-box">
                      <ion-icon name="mail-outline" />
                      <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="toi@email.com" />
                    </div>
                  </div>
                  <div className="field">
                    <label>Numéro de téléphone</label>
                    <div className="field-box">
                      <ion-icon name="call-outline" />
                      <input
                        className="input"
                        type="tel"
                        value={telephone}
                        onChange={(e) => setTelephone(e.target.value)}
                        placeholder="+225 07 08 09 10 11"
                        inputMode="tel"
                      />
                    </div>
                  </div>
                  <div className="row" style={{ gap: 12, alignItems: 'flex-start' }}>
                    <div className="field" style={{ flex: 1 }}>
                      <label>Mot de passe</label>
                      <div className="field-box">
                        <input className="input" type="password" value={mdp} onChange={(e) => setMdp(e.target.value)} placeholder="8+ caractères" />
                      </div>
                    </div>
                    <div className="field" style={{ flex: 1 }}>
                      <label>Confirmer</label>
                      <div className="field-box">
                        <input className="input" type="password" value={mdp2} onChange={(e) => setMdp2(e.target.value)} placeholder="••••••••" />
                      </div>
                    </div>
                  </div>
                  <div className="field">
                    <label>Date de naissance</label>
                    <div className="field-box">
                      <ion-icon name="calendar-outline" />
                      <input className="input" value={dob} onChange={(e) => setDob(e.target.value)} placeholder="JJ/MM/AAAA" inputMode="numeric" />
                    </div>
                  </div>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 26 }}>Parle-nous de toi</div>
                <div className="subtitle" style={{ marginTop: 5, fontSize: 14 }}>Tu pourras tout modifier plus tard.</div>

                <div style={{ marginTop: 22, fontSize: 12.5, fontWeight: 700 }}>Je suis…</div>
                <div className="row" style={{ marginTop: 10 }}>
                  {[
                    { v: 'femme', l: 'Femme' },
                    { v: 'homme', l: 'Homme' },
                    { v: 'nb', l: 'Non-binaire' },
                  ].map((g) => (
                    <button
                      key={g.v}
                      type="button"
                      className={`opt${genre === g.v ? ' active' : ''}`}
                      style={{ flex: 1, justifyContent: 'center', padding: '11px 16px', borderRadius: 13, fontSize: 14 }}
                      onClick={() => setGenre(g.v)}
                    >
                      {g.l}
                    </button>
                  ))}
                </div>

                <div style={{ marginTop: 22, fontSize: 12.5, fontWeight: 700 }}>Je cherche surtout…</div>
                <div className="row" style={{ marginTop: 10, gap: 12 }}>
                  <button
                    type="button"
                    onClick={() => setMode('rencontre')}
                    style={{
                      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9, padding: 18, borderRadius: 16, cursor: 'pointer',
                      border: `1.5px solid ${mode === 'rencontre' ? 'var(--accent)' : 'var(--border)'}`,
                      background: mode === 'rencontre' ? 'rgba(214,40,110,.06)' : 'var(--field)',
                    }}
                  >
                    <ion-icon name="heart" style={{ fontSize: 24, color: '#ff6fa8' }} />
                    <span style={{ fontSize: 14, fontWeight: 700 }}>Rencontre</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('amitie')}
                    style={{
                      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9, padding: 18, borderRadius: 16, cursor: 'pointer',
                      border: `1.5px solid ${mode === 'amitie' ? '#5a7fd6' : 'var(--border)'}`,
                      background: mode === 'amitie' ? 'rgba(90,127,214,.08)' : 'var(--field)',
                    }}
                  >
                    <ion-icon name="people" style={{ fontSize: 24, color: '#5a7fd6' }} />
                    <span style={{ fontSize: 14, fontWeight: 700 }}>Amitié</span>
                  </button>
                </div>

                <div style={{ marginTop: 24, fontSize: 12.5, fontWeight: 700 }}>Écart d'âge accepté</div>
                <div className="row" style={{ marginTop: 6, gap: 6, alignItems: 'center' }}>
                  <ion-icon name="lock-closed" style={{ fontSize: 12, flexShrink: 0, color: 'rgba(var(--ink),.5)' }} />
                  <span style={{ fontSize: 11.5, color: 'rgba(var(--ink),.5)' }}>
                    Choix définitif — autour de ton âge, jamais en dessous de 18 ans.
                  </span>
                </div>
                <div className="row" style={{ marginTop: 12, flexWrap: 'wrap', gap: 9 }}>
                  {ECARTS.map((e) => {
                    const on = ecart === e.v
                    return (
                      <button
                        key={e.v}
                        type="button"
                        onClick={() => setEcart(e.v)}
                        style={{
                          padding: '10px 16px', borderRadius: 99, cursor: 'pointer', fontSize: 13.5, fontWeight: 700,
                          border: `1.5px solid ${on ? 'var(--accent)' : 'var(--border)'}`,
                          background: on ? 'rgba(214,40,110,.1)' : 'var(--field)',
                          color: on ? 'var(--accent)' : 'var(--text)',
                        }}
                      >
                        {e.l}
                      </button>
                    )
                  })}
                </div>

                <div style={{ marginTop: 22 }} className="field">
                  <label>Ville</label>
                  <div className="field-box">
                    <ion-icon name="location-outline" />
                    {villes.length > 0 ? (
                      <select className="select" value={ville} onChange={(e) => setVille(e.target.value)}>
                        <option value="">Choisis ta ville</option>
                        {villes.map((v) => (
                          <option key={v} value={v}>{v}</option>
                        ))}
                      </select>
                    ) : (
                      <input className="input" value={ville} onChange={(e) => setVille(e.target.value)} placeholder="Abidjan" />
                    )}
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 26 }}>Tes centres d'intérêt</div>
                <div className="subtitle" style={{ marginTop: 5, fontSize: 14 }}>
                  Choisis-en au moins 3 pour de meilleures suggestions de cercles.
                </div>
                <div className="row" style={{ marginTop: 22, flexWrap: 'wrap', gap: 10 }}>
                  {INTERETS.map((i) => {
                    const on = interets.includes(i)
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => toggleInteret(i)}
                        style={{
                          padding: '9px 15px', borderRadius: 99, cursor: 'pointer', fontSize: 13.5, fontWeight: 600,
                          border: `1.5px solid ${on ? 'var(--accent)' : 'var(--border)'}`,
                          background: on ? 'rgba(214,40,110,.1)' : 'var(--field)',
                          color: on ? 'var(--accent)' : 'var(--text)',
                        }}
                      >
                        {i}
                      </button>
                    )
                  })}
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 26 }}>Vérifie ton identité</div>
                <div className="subtitle" style={{ marginTop: 5, fontSize: 14 }}>
                  Ce selfie sert <b>uniquement à vérifier</b> que ton profil est authentique : il ne sera{' '}
                  <b>jamais affiché</b> et ne sera pas ta photo de profil (tu la choisiras à l'étape suivante).
                  Il se prend en direct avec ta caméra — impossible d'importer une photo.
                </div>
                <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div
                    style={{
                      width: 200, height: 200, borderRadius: '50%', border: '2.5px dashed rgba(214,40,110,.4)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', background: 'var(--field)',
                    }}
                  >
                    {cameraOn ? (
                      <video
                        ref={videoRef}
                        playsInline
                        muted
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
                      />
                    ) : selfie ? (
                      <>
                        <img src={selfie} alt="Selfie" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div
                          style={{
                            position: 'relative', width: 60, height: 60, borderRadius: 30, background: 'rgba(67,224,138,.9)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <ion-icon name="checkmark" style={{ fontSize: 34, color: '#fff' }} />
                        </div>
                      </>
                    ) : (
                      <ion-icon name="camera-outline" style={{ fontSize: 56, color: 'rgba(214,40,110,.45)' }} />
                    )}
                  </div>

                  {cameraOn ? (
                    <button className="btn btn-primary" type="button" onClick={captureSelfie} style={{ marginTop: 24, padding: '13px 28px' }}>
                      <ion-icon name="camera" style={{ fontSize: 18 }} />
                      Capturer
                    </button>
                  ) : selfie ? (
                    <>
                      <div className="row" style={{ marginTop: 20, gap: 7, color: '#43a35a' }}>
                        <ion-icon name="checkmark-circle" style={{ fontSize: 18 }} />
                        <span style={{ fontSize: 14, fontWeight: 700 }}>Selfie capturé ✓</span>
                      </div>
                      <button
                        type="button"
                        className="link"
                        style={{ marginTop: 10, fontSize: 13, fontWeight: 600 }}
                        onClick={() => {
                          setSelfie(null)
                          startCamera()
                        }}
                      >
                        Reprendre
                      </button>
                    </>
                  ) : (
                    <button className="btn btn-primary" type="button" onClick={startCamera} style={{ marginTop: 24, padding: '13px 28px' }}>
                      <ion-icon name="camera" style={{ fontSize: 18 }} />
                      Prendre un selfie
                    </button>
                  )}
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 26 }}>Ajoute tes photos</div>
                <div className="subtitle" style={{ marginTop: 5, fontSize: 14 }}>
                  Une photo de profil et au moins une deuxième. Les autres se révèlent au fil de tes liens.
                </div>
                <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                  {photos.map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => pickPhoto(i)}
                      style={{
                        aspectRatio: '3/4', borderRadius: 16, cursor: 'pointer', position: 'relative', overflow: 'hidden',
                        border: '1.5px dashed rgba(255,140,190,.4)', background: 'transparent',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
                      }}
                    >
                      {p ? (
                        <>
                          <img src={p} alt={PHOTO_LABELS[i]} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                          <div
                            style={{
                              position: 'absolute', top: 8, right: 8, width: 24, height: 24, borderRadius: 12,
                              background: 'rgba(67,224,138,.92)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                          >
                            <ion-icon name="checkmark" style={{ fontSize: 14, color: '#fff' }} />
                          </div>
                        </>
                      ) : (
                        <>
                          <ion-icon name="add" style={{ fontSize: 26, color: 'var(--accent)' }} />
                          <span style={{ fontSize: 10.5, fontWeight: 600, color: 'rgba(var(--ink),.5)' }}>{PHOTO_LABELS[i]}</span>
                        </>
                      )}
                    </button>
                  ))}
                </div>
                <input ref={filePhotoRef} type="file" accept="image/*" hidden onChange={onPhotoFile} />
              </>
            )}

            {step === 5 && (
              <>
                <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 26 }}>Presque terminé !</div>
                <div className="subtitle" style={{ marginTop: 5, fontSize: 14 }}>Une dernière chose avant de découvrir tes cercles.</div>
                <div className="card" style={{ marginTop: 24, borderRadius: 18 }}>
                  <div className="row" style={{ gap: 11 }}>
                    <div className="charte-icon">
                      <ion-icon name="shield-checkmark" style={{ fontSize: 22, color: '#06281a' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14.5, fontWeight: 700 }}>Charte de bienveillance KADY</div>
                      <div className="subtitle" style={{ marginTop: 2, fontSize: 12.5 }}>Respect, authenticité, consentement.</div>
                    </div>
                  </div>
                </div>
                {/* Lecture obligatoire des deux documents avant de pouvoir cocher. */}
                <div className="stack" style={{ marginTop: 16, gap: 10 }}>
                  {(
                    [
                      { k: 'cgu' as const, titre: "Conditions d'utilisation", lu: luConditions },
                      { k: 'confidentialite' as const, titre: 'Politique de confidentialité', lu: luConfidentialite },
                    ]
                  ).map((d) => (
                    <button
                      key={d.k}
                      type="button"
                      onClick={() => setDocOuvert(d.k)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12, padding: '13px 15px', borderRadius: 13,
                        border: `1.5px solid ${d.lu ? 'var(--accent)' : 'var(--border)'}`, background: 'var(--field)',
                        cursor: 'pointer', textAlign: 'left', width: '100%',
                      }}
                    >
                      <ion-icon
                        name={d.lu ? 'checkmark-circle' : 'document-text-outline'}
                        style={{ fontSize: 20, color: d.lu ? 'var(--accent)' : 'rgba(var(--ink),.45)', flexShrink: 0 }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 700 }}>{d.titre}</div>
                        <div style={{ fontSize: 11.5, color: 'rgba(var(--ink),.5)', marginTop: 2 }}>
                          {d.lu ? 'Lu ✓' : 'Lecture obligatoire — appuie pour lire'}
                        </div>
                      </div>
                      <ion-icon name="chevron-forward" style={{ fontSize: 16, color: 'rgba(var(--ink),.4)' }} />
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => docsLus && setCgu((v) => !v)}
                  disabled={!docsLus}
                  style={{
                    marginTop: 16, width: '100%', display: 'flex', alignItems: 'flex-start', gap: 12, padding: 4,
                    textAlign: 'left', opacity: docsLus ? 1 : 0.45, cursor: docsLus ? 'pointer' : 'not-allowed',
                  }}
                >
                  <div
                    style={{
                      width: 22, height: 22, borderRadius: 7, flexShrink: 0,
                      border: `1.5px solid ${cgu ? 'var(--accent)' : 'var(--border)'}`,
                      background: cgu ? 'var(--accent)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {cgu && <ion-icon name="checkmark" style={{ fontSize: 15, color: '#fff' }} />}
                  </div>
                  <span style={{ fontSize: 13.5, lineHeight: '20px', color: 'rgba(var(--ink),.7)' }}>
                    J'ai lu et j'accepte les <b style={{ color: 'var(--accent)' }}>conditions d'utilisation</b> et la{' '}
                    <b style={{ color: 'var(--accent)' }}>politique de confidentialité</b>, et je confirme avoir 18 ans ou plus.
                  </span>
                </button>
                {!docsLus && (
                  <div style={{ marginTop: 8, fontSize: 11.5, color: 'rgba(var(--ink),.5)', paddingLeft: 38 }}>
                    Lis d'abord les deux documents ci-dessus pour débloquer la case.
                  </div>
                )}
              </>
            )}
          </div>

          {error && (
            <div className="error-banner" style={{ marginTop: 16 }}>
              <ion-icon name="alert-circle" />
              {error}
            </div>
          )}

          <button className="btn btn-primary" type="button" onClick={suivant} disabled={loading} style={{ width: '100%', marginTop: 24, padding: 15 }}>
            {loading ? 'Création…' : step === 5 ? 'Créer mon compte' : 'Continuer'}
            <ion-icon name="arrow-forward" style={{ fontSize: 17 }} />
          </button>

          <p className="subtitle" style={{ textAlign: 'center', marginTop: 20, fontSize: 13.5 }}>
            Déjà inscrit ? <Link className="link" to="/login">Connecte-toi</Link>
          </p>
        </div>
      </div>

      {docOuvert === 'cgu' && (
        <LegalModal doc={CONDITIONS} onClose={() => setDocOuvert(null)} onLu={() => setLuConditions(true)} />
      )}
      {docOuvert === 'confidentialite' && (
        <LegalModal doc={CONFIDENTIALITE} onClose={() => setDocOuvert(null)} onLu={() => setLuConfidentialite(true)} />
      )}
    </div>
  )
}
