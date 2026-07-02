import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from '../store/toast'

const SLIDES = [
  { accent: '#ff6fa8', icon: 'people-circle', title: 'Tout commence en cercle', sub: "Rejoins des petites communautés (max 10) autour d'une passion. C'est là que les liens naissent." },
  { accent: '#8f9dff', icon: 'lock-closed', title: 'Pas de DM sans cercle partagé', sub: "Impossible d'écrire à quelqu'un tant que vous ne partagez pas un cercle. Fini les messages non sollicités." },
  { accent: '#ff9d5c', icon: 'trending-up', title: 'La confiance se construit', sub: 'Chaque lien progresse par niveaux. Photos et fonctions se débloquent à mesure que vous vous découvrez.' },
  { accent: '#2fb8c0', icon: 'sparkles', title: 'Profil à découvrir', sub: 'Au début, tu ne vois que la photo, le prénom et l’âge. Le reste se révèle au fil de vos conversations.' },
  { accent: '#43e08a', icon: 'heart-half', title: 'Rencontre ou Amitié', sub: 'À toi de choisir le sens de chaque connexion. KADY te propose ce qui te correspond vraiment.' },
]

export default function Onboarding() {
  const navigate = useNavigate()
  const [i, setI] = useState(0)
  const slide = SLIDES[i]
  const dernier = i === SLIDES.length - 1

  function terminer() {
    navigate('/')
    toast('Bienvenue sur KADY 🎉')
  }

  return (
    <div className="ksplit">
      <div
        className="ksplit-art"
        style={{
          position: 'relative', overflow: 'hidden', background: 'linear-gradient(160deg,#241241,#5a1d52 60%,#bb1659)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 56,
        }}
      >
        <div className="onb-orbit" />
        <div className="onb-halo" />
        <div className="onb-icon" style={{ background: slide.accent }}>
          <ion-icon name={slide.icon} style={{ fontSize: 78, color: '#fff' }} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 40px', background: 'var(--bg2)' }}>
        <div key={i} style={{ width: '100%', maxWidth: 420, margin: '0 auto', animation: 'kfade .35s ease' }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--accent)' }}>
            Bienvenue sur KADY
          </div>
          <div style={{ marginTop: 16, fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 34, lineHeight: '40px' }}>
            {slide.title}
          </div>
          <p style={{ marginTop: 16, fontSize: 16, lineHeight: '26px', color: 'rgba(var(--ink),.62)' }}>{slide.sub}</p>

          <div className="row" style={{ marginTop: 30, gap: 7 }}>
            {SLIDES.map((_, d) => (
              <button
                key={d}
                type="button"
                onClick={() => setI(d)}
                aria-label={`Slide ${d + 1}`}
                style={{
                  height: 7, borderRadius: 99, cursor: 'pointer', transition: 'all .25s', padding: 0, border: 'none',
                  width: d === i ? 26 : 7,
                  background: d === i ? 'var(--accent)' : 'rgba(var(--ink),.18)',
                }}
              />
            ))}
          </div>

          <div className="row" style={{ marginTop: 34, gap: 12 }}>
            {i > 0 && (
              <button
                className="icon-btn"
                type="button"
                onClick={() => setI(i - 1)}
                aria-label="Précédent"
                style={{ width: 52, height: 52, borderRadius: 14 }}
              >
                <ion-icon name="chevron-back" style={{ fontSize: 22 }} />
              </button>
            )}
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => (dernier ? terminer() : setI(i + 1))}
              style={{ flex: 1, padding: 16 }}
            >
              {dernier ? 'Commencer' : 'Suivant'}
              <ion-icon name="arrow-forward" style={{ fontSize: 17 }} />
            </button>
          </div>

          <button
            type="button"
            onClick={terminer}
            style={{ marginTop: 18, width: '100%', textAlign: 'center', fontSize: 13.5, fontWeight: 600, color: 'rgba(var(--ink),.45)' }}
          >
            Passer l'intro
          </button>
        </div>
      </div>
    </div>
  )
}
