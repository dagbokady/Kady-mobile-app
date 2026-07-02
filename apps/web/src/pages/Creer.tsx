import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cercles as cerclesApi } from '../api'
import { apiError } from '../api/client'
import { themeVisual } from '../themeVisual'
import { toast } from '../store/toast'

const CATS = [
  { emoji: '🎬', label: 'Cinéma', theme: 'Cinéma' },
  { emoji: '💼', label: 'Business', theme: 'Entrepreneuriat' },
  { emoji: '🏃', label: 'Sport', theme: 'Sport' },
  { emoji: '🎨', label: 'Art', theme: 'Art' },
  { emoji: '🙏', label: 'Foi', theme: 'Foi' },
  { emoji: '✈️', label: 'Voyage', theme: 'Voyage' },
  { emoji: '🍳', label: 'Food', theme: 'Cuisine' },
  { emoji: '🎵', label: 'Musique', theme: 'Musique' },
]

const TAILLES = [6, 8, 10]

export default function Creer() {
  const navigate = useNavigate()
  const [nom, setNom] = useState('')
  const [cat, setCat] = useState(0)
  const [type, setType] = useState<'rencontre' | 'amitie'>('rencontre')
  const [max, setMax] = useState(10)
  const [prive, setPrive] = useState(false)
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const visual = themeVisual(CATS[cat].theme)
  const pct = ((max - 6) / (10 - 6)) * 100

  async function creer() {
    setError('')
    if (!nom.trim()) {
      setError('Donne un nom à ton cercle.')
      return
    }
    setBusy(true)
    try {
      const c = await cerclesApi.creer({
        nom: nom.trim(),
        theme: CATS[cat].theme,
        description: description.trim() || undefined,
        capacite_max: max,
      })
      toast(`Cercle « ${c.nom} » créé ✓`)
      navigate(`/cercles/${c.id}`)
    } catch (err) {
      setError(apiError(err))
      setBusy(false)
    }
  }

  return (
    <div className="kwrap" style={{ maxWidth: 620, padding: '34px 28px 80px', animation: 'kfade .3s ease' }}>
      <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 30, letterSpacing: '-.4px' }}>Créer un cercle</div>
      <div className="subtitle" style={{ marginTop: 6 }}>Rassemble une communauté autour d'une passion. De 6 à 10 membres.</div>

      {/* Aperçu couverture */}
      <div
        style={{
          marginTop: 24, position: 'relative', height: 150, borderRadius: 20, overflow: 'hidden', background: visual.gradient,
          display: 'flex', alignItems: 'flex-end', padding: 18, boxShadow: 'var(--cardShadow)',
        }}
      >
        <ion-icon
          name={visual.icon}
          style={{ position: 'absolute', right: -14, bottom: -20, fontSize: 120, color: 'rgba(255,255,255,.16)', transform: 'rotate(-10deg)' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent,rgba(10,6,20,.5))' }} />
        <button
          type="button"
          onClick={() => toast('Couvertures personnalisées — bientôt disponibles')}
          style={{
            position: 'absolute', top: 14, right: 14, display: 'flex', alignItems: 'center', gap: 5,
            padding: '8px 13px', borderRadius: 99, background: 'rgba(255,255,255,.2)', border: '1px solid rgba(255,255,255,.3)',
          }}
        >
          <ion-icon name="image-outline" style={{ fontSize: 14, color: '#fff' }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>Couverture</span>
        </button>
        <span style={{ position: 'relative', fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 22, color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,.4)' }}>
          {nom.trim() || 'Mon cercle'}
        </span>
      </div>

      {error && <div className="error-banner" style={{ marginTop: 16 }}>{error}</div>}

      <div style={{ marginTop: 22, fontSize: 13, fontWeight: 700 }}>Nom du cercle</div>
      <div className="field-box" style={{ marginTop: 9 }}>
        <ion-icon name="people-outline" style={{ fontSize: 18 }} />
        <input className="input" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex. Randonneurs d'Abidjan" />
      </div>

      <div style={{ marginTop: 22, fontSize: 13, fontWeight: 700 }}>Catégorie</div>
      <div className="kscroll" style={{ marginTop: 10, display: 'flex', gap: 9, overflowX: 'auto', paddingBottom: 4 }}>
        {CATS.map((c, i) => (
          <button
            key={c.label}
            type="button"
            onClick={() => setCat(i)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '10px 15px', borderRadius: 13, cursor: 'pointer',
              whiteSpace: 'nowrap', flexShrink: 0,
              border: `1.5px solid ${cat === i ? 'var(--accent)' : 'var(--border)'}`,
              background: cat === i ? 'rgba(214,40,110,.08)' : 'var(--field)',
            }}
          >
            <span style={{ fontSize: 16 }}>{c.emoji}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: cat === i ? 'var(--accent)' : 'var(--text)' }}>{c.label}</span>
          </button>
        ))}
      </div>

      <div style={{ marginTop: 22, fontSize: 13, fontWeight: 700 }}>Type de connexion</div>
      <div className="row" style={{ marginTop: 10, gap: 12 }}>
        <button
          type="button"
          onClick={() => setType('rencontre')}
          style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 18, borderRadius: 16, cursor: 'pointer',
            border: `1.5px solid ${type === 'rencontre' ? 'var(--accent)' : 'var(--border)'}`,
            background: type === 'rencontre' ? 'rgba(214,40,110,.06)' : 'var(--field)',
          }}
        >
          <ion-icon name="heart" style={{ fontSize: 24, color: type === 'rencontre' ? 'var(--accent)' : 'rgba(var(--ink),.6)' }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: type === 'rencontre' ? 'var(--accent)' : 'rgba(var(--ink),.6)' }}>Rencontre</span>
        </button>
        <button
          type="button"
          onClick={() => setType('amitie')}
          style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 18, borderRadius: 16, cursor: 'pointer',
            border: `1.5px solid ${type === 'amitie' ? 'var(--accent)' : 'var(--border)'}`,
            background: type === 'amitie' ? 'rgba(214,40,110,.06)' : 'var(--field)',
          }}
        >
          <ion-icon name="people" style={{ fontSize: 24, color: type === 'amitie' ? '#5a7fd6' : 'rgba(var(--ink),.6)' }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: type === 'amitie' ? '#5a7fd6' : 'rgba(var(--ink),.6)' }}>Amitié</span>
        </button>
      </div>

      <div style={{ marginTop: 22, fontSize: 13, fontWeight: 700 }}>Description</div>
      <div className="field-box" style={{ marginTop: 9 }}>
        <textarea
          className="textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ce que votre cercle partage, son ambiance, ses rendez-vous…"
        />
      </div>

      <div style={{ marginTop: 18, padding: 18, borderRadius: 16, background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--cardShadow)' }}>
        <div className="row between">
          <span style={{ fontSize: 13.5, fontWeight: 700 }}>Membres maximum</span>
          <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--accentDeep)' }}>{max}</span>
        </div>
        <div style={{ marginTop: 14, position: 'relative', height: 7, borderRadius: 99, background: 'rgba(var(--ink),.12)' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, height: 7, borderRadius: 99, background: 'var(--brand)', width: `${pct}%`, transition: 'width .2s' }} />
          <div
            style={{
              position: 'absolute', top: '50%', left: `${pct}%`, width: 20, height: 20, borderRadius: 10, background: '#fff',
              border: '2px solid #ff6aa9', transform: 'translate(-50%,-50%)', boxShadow: '0 3px 8px rgba(214,40,110,.35)', transition: 'left .2s',
            }}
          />
        </div>
        <div className="row" style={{ marginTop: 12, gap: 8 }}>
          {TAILLES.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setMax(n)}
              style={{
                flex: 1, padding: 9, borderRadius: 10, cursor: 'pointer', border: '1px solid var(--border)',
                background: max === n ? 'var(--brand)' : 'var(--field)',
              }}
            >
              <span style={{ fontSize: 12.5, fontWeight: 700, color: max === n ? '#fff' : 'var(--text)' }}>{n}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="settings-row" style={{ marginTop: 14 }}>
        <div className="menu-icon" style={{ background: 'rgba(123,224,160,.14)' }}>
          <ion-icon name="lock-closed" style={{ fontSize: 20, color: '#1f9d57' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Cercle privé</div>
          <div style={{ marginTop: 2, fontSize: 11.5, color: 'rgba(var(--ink),.5)' }}>
            {prive ? 'Sur invitation uniquement' : 'Visible de tous'}
          </div>
        </div>
        <button
          type="button"
          className={`toggle${prive ? ' on' : ''}`}
          onClick={() => {
            const next = !prive
            setPrive(next)
            if (next) toast('Cercles privés — bientôt : ton cercle restera visible pour l’instant')
          }}
          aria-label="Cercle privé"
        >
          <div className="toggle-knob" />
        </button>
      </div>

      <button className="btn btn-primary" type="button" style={{ marginTop: 24, width: '100%', padding: 16, borderRadius: 16 }} onClick={creer} disabled={busy}>
        <ion-icon name="add" style={{ fontSize: 19 }} />
        {busy ? 'Création…' : 'Créer mon cercle'}
      </button>
    </div>
  )
}
