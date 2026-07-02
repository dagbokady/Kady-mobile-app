import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cercles as cerclesApi, notifications as notificationsApi, relations as relationsApi } from '../api'
import { apiError } from '../api/client'
import type { Cercle, Notif } from '../api/types'
import { useAuth } from '../store/auth'
import { themeVisual } from '../themeVisual'
import { notifVisual, tempsRelatif } from '../visuals'
import HowModal from '../components/HowModal'

const HERO = [
  { grad: 'linear-gradient(135deg,#ff9d5c,#d34d7e,#3a1c5e)', chip: 'Communauté', title: 'Les cercles, au cœur de KADY', sub: 'Rejoignez des communautés, partagez et créez des liens authentiques.' },
  { grad: 'linear-gradient(135deg,#7fe0d0,#2f9aa8,#1d3f66)', chip: '', title: 'Voyagez ensemble, créez des souvenirs', sub: 'Découvrez des cercles de voyageurs près de chez vous.' },
  { grad: 'linear-gradient(135deg,#7be0a0,#2f9ac2,#2a2c66)', chip: '', title: 'Partagez vos passions sportives', sub: 'Bougez, progressez et rencontrez des partenaires motivés.' },
  { grad: 'linear-gradient(135deg,#b07bff,#7a4fd6,#2a1c5e)', chip: '', title: 'Une communauté bienveillante', sub: 'Des échanges respectueux, des rencontres qui comptent.' },
]

export default function Accueil() {
  const me = useAuth((s) => s.me)
  const navigate = useNavigate()
  const [mesCercles, setMesCercles] = useState<Cercle[]>([])
  const [relationsCount, setRelationsCount] = useState(0)
  const [notifs, setNotifs] = useState<Notif[]>([])
  const [error, setError] = useState('')
  const [slide, setSlide] = useState(0)
  const [showHow, setShowHow] = useState(false)

  useEffect(() => {
    Promise.all([cerclesApi.list(), relationsApi.list(), notificationsApi.list()])
      .then(([cercles, relations, notifications]) => {
        setMesCercles(cercles.filter((c) => c.rejoint))
        setRelationsCount(relations.length)
        setNotifs(notifications.slice(0, 3))
      })
      .catch((err) => setError(apiError(err)))
  }, [])

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % HERO.length), 4800)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="kwrap" style={{ padding: '34px 28px 70px', animation: 'kfade .3s ease' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <div className="title">Bonjour {me?.prenom ?? ''} 👋</div>
          <div className="subtitle" style={{ marginTop: 6, fontSize: 15 }}>Prêt à créer de belles connexions aujourd'hui ?</div>
        </div>
        <div className="row" style={{ gap: 10 }}>
          <button
            type="button"
            onClick={() => setShowHow(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '12px 18px', borderRadius: 13,
              background: 'linear-gradient(135deg,rgba(255,106,169,.16),rgba(143,157,255,.12))',
              border: '1px solid rgba(255,140,190,.4)',
            }}
          >
            <ion-icon name="sparkles" style={{ fontSize: 17, color: 'var(--accentDeep)' }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--accentDeep)' }}>Comment ça marche</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/decouvrir')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '12px 18px', borderRadius: 13,
              background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--cardShadow)',
            }}
          >
            <ion-icon name="compass" style={{ fontSize: 18, color: 'var(--accent)' }} />
            <span style={{ fontSize: 14, fontWeight: 700 }}>Explorer les cercles</span>
          </button>
        </div>
      </div>

      {error && <div className="error-banner" style={{ marginTop: 16 }}>{error}</div>}

      {/* Hero carousel */}
      <div
        style={{
          marginTop: 24, borderRadius: 26, overflow: 'hidden', height: 300, border: '1px solid var(--border)',
          position: 'relative', boxShadow: 'var(--cardShadow)',
        }}
      >
        <div
          style={{
            display: 'flex', width: '400%', height: '100%',
            transition: 'transform .6s cubic-bezier(.65,0,.2,1)', transform: `translateX(-${slide * 25}%)`,
          }}
        >
          {HERO.map((sl) => (
            <div key={sl.title} style={{ width: '25%', height: '100%', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, background: sl.grad }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(110deg,rgba(10,6,20,.72),rgba(10,6,20,.15) 65%)' }} />
              <div style={{ position: 'absolute', inset: 0, padding: 44, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 620 }}>
                {sl.chip && (
                  <div
                    style={{
                      alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 7, padding: '7px 14px',
                      borderRadius: 99, background: 'rgba(255,255,255,.16)', border: '1px solid rgba(255,255,255,.24)', marginBottom: 16,
                    }}
                  >
                    <ion-icon name="people-outline" style={{ fontSize: 14, color: '#fff' }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{sl.chip}</span>
                  </div>
                )}
                <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 36, lineHeight: '42px', color: '#fff', textShadow: '0 2px 14px rgba(0,0,0,.3)' }}>
                  {sl.title}
                </div>
                <div style={{ marginTop: 14, fontSize: 16, lineHeight: '24px', color: 'rgba(255,255,255,.88)', maxWidth: 440 }}>{sl.sub}</div>
                <button
                  type="button"
                  onClick={() => navigate('/decouvrir')}
                  style={{
                    alignSelf: 'flex-start', marginTop: 24, display: 'flex', alignItems: 'center', gap: 8,
                    padding: '13px 22px', borderRadius: 13, background: '#fff', boxShadow: '0 10px 22px rgba(0,0,0,.25)',
                  }}
                >
                  <span style={{ fontSize: 14.5, fontWeight: 700, color: '#211633' }}>Découvrir</span>
                  <ion-icon name="arrow-forward" style={{ fontSize: 16, color: '#211633' }} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', right: 28, bottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
          {HERO.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSlide(i)}
              aria-label={`Slide ${i + 1}`}
              style={{
                height: 8, borderRadius: 99, cursor: 'pointer', transition: 'all .25s', padding: 0, border: 'none',
                width: i === slide ? 28 : 8,
                background: i === slide ? '#fff' : 'rgba(255,255,255,.45)',
              }}
            />
          ))}
        </div>
      </div>

      <div className="kdash" style={{ marginTop: 30 }}>
        <div>
          <div className="row between">
            <div className="row" style={{ gap: 10 }}>
              <ion-icon name="people" style={{ fontSize: 21, color: 'var(--accent)' }} />
              <span className="section-title">Mes cercles</span>
            </div>
            <button type="button" className="row" style={{ gap: 3 }} onClick={() => navigate('/decouvrir')}>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--accent)' }}>Voir tous</span>
              <ion-icon name="chevron-forward" style={{ fontSize: 15, color: 'var(--accent)' }} />
            </button>
          </div>

          <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 14 }}>
            <button
              type="button"
              onClick={() => navigate('/creer')}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
                padding: '22px 12px', borderRadius: 20, border: '1.5px dashed rgba(255,106,169,.45)', background: 'rgba(255,106,169,.05)',
              }}
            >
              <div style={{ width: 54, height: 54, borderRadius: 27, background: 'rgba(255,106,169,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ion-icon name="add" style={{ fontSize: 26, color: 'var(--accent)' }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 13.5, fontWeight: 700 }}>Créer</div>
                <div style={{ fontSize: 11.5, color: 'rgba(var(--ink),.45)' }}>un cercle</div>
              </div>
            </button>

            {mesCercles.map((c) => {
              const visual = themeVisual(c.theme)
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => navigate(`/cercles/${c.id}`)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 11, padding: '20px 12px',
                    borderRadius: 20, background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--cardShadow)',
                  }}
                >
                  <div style={{ width: 58, height: 58, borderRadius: 29, padding: 2.5, background: visual.gradient, position: 'relative' }}>
                    <div
                      style={{
                        width: '100%', height: '100%', borderRadius: 27, background: visual.gradient,
                        border: '2px solid var(--card)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <ion-icon name={visual.icon} style={{ color: '#fff', fontSize: 22 }} />
                    </div>
                    <div
                      style={{
                        position: 'absolute', bottom: -3, right: -3, minWidth: 22, height: 22, padding: '0 5px', borderRadius: 11,
                        background: 'var(--card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accentDeep)' }}>{c.membres}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700 }}>{c.nom}</div>
                    <div style={{ fontSize: 11.5, color: 'rgba(var(--ink),.45)' }}>{c.theme ?? `${c.membres} membres`}</div>
                  </div>
                </button>
              )
            })}
          </div>

          {notifs.length > 0 && (
            <>
              <div className="row" style={{ marginTop: 30, gap: 10 }}>
                <ion-icon name="flash" style={{ fontSize: 20, color: 'var(--accent)' }} />
                <span className="section-title">Activité dans vos cercles</span>
              </div>
              <div className="stack" style={{ marginTop: 16, gap: 12 }}>
                {notifs.map((n) => {
                  const v = notifVisual(n.type)
                  return (
                    <div
                      key={n.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 14, padding: 15, borderRadius: 18,
                        background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--cardShadow)', width: '100%',
                      }}
                    >
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <div style={{ width: 50, height: 50, borderRadius: 15, background: 'linear-gradient(135deg,#7fe0d0,#2f9aa8,#1d3f66)' }} />
                        <div
                          style={{
                            position: 'absolute', bottom: -5, right: -5, width: 25, height: 25, borderRadius: 13,
                            background: 'var(--card2)', border: '2px solid var(--card)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <ion-icon name={v.icon} style={{ fontSize: 12, color: 'var(--accent)' }} />
                        </div>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14.5, lineHeight: '20px', color: 'rgba(var(--ink),.72)' }}>
                          <b style={{ color: 'var(--text)' }}>{n.titre}</b> {n.corps}
                        </div>
                        <div style={{ marginTop: 3, fontSize: 12, color: 'rgba(var(--ink),.42)' }}>{tempsRelatif(n.created_at)}</div>
                      </div>
                      <ion-icon name="chevron-forward" style={{ fontSize: 18, color: 'rgba(var(--ink),.3)', flexShrink: 0 }} />
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>

        <div className="kdash-side" style={{ display: 'flex', flexDirection: 'column', gap: 18, position: 'sticky', top: 88 }}>
          <div style={{ display: 'flex', padding: 6, borderRadius: 20, background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--cardShadow)' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '14px 0' }}>
              <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 22 }}>{mesCercles.length}</span>
              <span style={{ marginTop: 2, fontSize: 11.5, color: 'rgba(var(--ink),.5)' }}>Cercles</span>
            </div>
            <div style={{ width: 1, background: 'var(--border)', margin: '10px 0' }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '14px 0' }}>
              <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 22 }}>{relationsCount}</span>
              <span style={{ marginTop: 2, fontSize: 11.5, color: 'rgba(var(--ink),.5)' }}>Relations</span>
            </div>
          </div>

          {!me?.premium && (
            <div
              style={{
                position: 'relative', overflow: 'hidden', padding: 22, borderRadius: 22,
                border: '1px solid rgba(255,106,169,.28)', background: 'linear-gradient(135deg,rgba(255,106,169,.16),rgba(255,106,169,.06))',
              }}
            >
              <div style={{ position: 'absolute', top: -30, right: -20, width: 130, height: 130, borderRadius: 65, background: 'rgba(255,106,169,.26)' }} />
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 52, height: 52, borderRadius: 16, background: 'var(--brand)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 14px rgba(255,106,169,.5)',
                  }}
                >
                  <ion-icon name="diamond" style={{ fontSize: 23, color: '#fff' }} />
                </div>
                <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 17 }}>Passez Premium</div>
              </div>
              <div style={{ position: 'relative', marginTop: 12, fontSize: 13.5, lineHeight: '20px', color: 'rgba(var(--ink),.6)' }}>
                Cercles & messages illimités, statistiques, et bien plus.
              </div>
              <button
                type="button"
                onClick={() => navigate('/premium')}
                style={{
                  position: 'relative', marginTop: 16, width: '100%', padding: 13, borderRadius: 13, background: 'var(--brand)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, boxShadow: '0 10px 16px rgba(255,106,169,.45)',
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Découvrir Premium</span>
                <ion-icon name="chevron-forward" style={{ fontSize: 16, color: '#fff' }} />
              </button>
            </div>
          )}
        </div>
      </div>

      {showHow && <HowModal onClose={() => setShowHow(false)} />}
    </div>
  )
}
