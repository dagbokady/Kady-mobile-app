import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { cercles as cerclesApi } from '../api'
import { apiError } from '../api/client'
import type { Cercle } from '../api/types'
import { themeVisual } from '../themeVisual'
import { gradeOf } from '../visuals'
import { toast } from '../store/toast'

const GRADE_FILTERS: Array<{ v: string; l: string; icon: string }> = [
  { v: 'all', l: 'Tous', icon: 'apps' },
  { v: '1', l: 'Graine', icon: 'leaf' },
  { v: '2', l: 'Flamme', icon: 'flame' },
  { v: '3', l: 'Étoile', icon: 'star' },
  { v: '5', l: 'Légendaire', icon: 'sparkles' },
]

export default function Decouvrir() {
  const [list, setList] = useState<Cercle[]>([])
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const [chip, setChip] = useState('Tous')
  const [advOpen, setAdvOpen] = useState(false)
  const [places, setPlaces] = useState<'all' | 'dispo' | 'few'>('all')
  const [grade, setGrade] = useState('all')
  const [tri, setTri] = useState<'pop' | 'recent'>('pop')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    cerclesApi
      .list()
      .then(setList)
      .catch((err) => setError(apiError(err)))
      .finally(() => setLoading(false))
  }, [])

  const themes = useMemo(() => {
    const set = new Set<string>()
    list.forEach((c) => c.theme && set.add(c.theme))
    return ['Tous', ...Array.from(set)]
  }, [list])

  const displayed = useMemo(() => {
    const query = q.trim().toLowerCase()
    let out = list.filter((c) => {
      if (chip !== 'Tous' && c.theme !== chip) return false
      if (grade !== 'all' && c.niveau !== Number(grade)) return false
      if (places === 'dispo' && c.membres >= c.capacite_max) return false
      if (places === 'few' && c.capacite_max - c.membres > 3) return false
      if (query) {
        const hay = `${c.nom} ${c.theme ?? ''} ${c.description ?? ''}`.toLowerCase()
        if (!hay.includes(query)) return false
      }
      return true
    })
    if (tri === 'pop') out = [...out].sort((a, b) => b.membres - a.membres)
    return out
  }, [list, chip, grade, places, tri, q])

  const advCount = (places !== 'all' ? 1 : 0) + (grade !== 'all' ? 1 : 0)

  function setQ(value: string) {
    setParams(value ? { q: value } : {}, { replace: true })
  }

  function resetAdv() {
    setPlaces('all')
    setGrade('all')
    setTri('pop')
    setChip('Tous')
    setQ('')
  }

  async function join(c: Cercle, e: React.MouseEvent) {
    e.stopPropagation()
    try {
      await cerclesApi.join(c.id)
      setList((prev) => prev.map((x) => (x.id === c.id ? { ...x, rejoint: true, membres: x.membres + 1 } : x)))
      toast('Cercle rejoint ✓')
    } catch (err) {
      setError(apiError(err))
    }
  }

  const optClass = (on: boolean) => `opt${on ? ' active' : ''}`

  return (
    <div className="kwrap" style={{ padding: '34px 28px 70px', animation: 'kfade .3s ease' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div className="title">Découvrir</div>
          <div className="subtitle" style={{ marginTop: 6, fontSize: 15, maxWidth: 520 }}>
            Trouve un cercle qui te ressemble. Lis la salle d'accueil avant de rejoindre.
          </div>
        </div>
        <div className="row" style={{ gap: 10 }}>
          <div className="field-box" style={{ minWidth: 240, padding: '11px 15px', borderRadius: 13 }}>
            <ion-icon name="search" style={{ fontSize: 18 }} />
            <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher un thème…" style={{ fontSize: 14 }} />
            {q && (
              <button type="button" onClick={() => setQ('')} aria-label="Effacer" style={{ display: 'flex' }}>
                <ion-icon name="close-circle" style={{ fontSize: 17, color: 'rgba(var(--ink),.35)' }} />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setAdvOpen((v) => !v)}
            aria-label="Filtres avancés"
            style={{
              position: 'relative', width: 46, height: 46, borderRadius: 13, flexShrink: 0, display: 'flex',
              alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              border: `1px solid ${advOpen || advCount ? 'var(--accent)' : 'var(--border)'}`,
              background: advOpen || advCount ? 'rgba(214,40,110,.08)' : 'var(--field)',
            }}
          >
            <ion-icon name="options-outline" style={{ fontSize: 21, color: advOpen || advCount ? 'var(--accent)' : 'rgba(var(--ink),.6)' }} />
            {advCount > 0 && (
              <div
                style={{
                  position: 'absolute', top: -5, right: -5, minWidth: 18, height: 18, padding: '0 4px', borderRadius: 9,
                  background: '#ff4d97', border: '2px solid var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>{advCount}</span>
              </div>
            )}
          </button>
        </div>
      </div>

      {error && <div className="error-banner" style={{ marginTop: 16 }}>{error}</div>}

      {advOpen && (
        <div
          className="stack"
          style={{
            marginTop: 18, padding: 20, borderRadius: 18, background: 'var(--card)', border: '1px solid var(--border)',
            boxShadow: 'var(--cardShadow)', gap: 18, animation: 'kfade .2s ease',
          }}
        >
          <div className="row between">
            <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 16 }}>Filtres avancés</span>
            <button type="button" className="link" style={{ fontSize: 12.5, fontWeight: 600 }} onClick={resetAdv}>
              Réinitialiser
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28 }}>
            <div>
              <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.6px', textTransform: 'uppercase', color: 'rgba(var(--ink),.5)', marginBottom: 10 }}>
                Places disponibles
              </div>
              <div className="row" style={{ gap: 8 }}>
                {([['all', 'Toutes'], ['dispo', 'Disponibles'], ['few', 'Presque pleins']] as const).map(([v, l]) => (
                  <button key={v} type="button" className={optClass(places === v)} onClick={() => setPlaces(v)}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.6px', textTransform: 'uppercase', color: 'rgba(var(--ink),.5)', marginBottom: 10 }}>
                Grade du cercle
              </div>
              <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
                {GRADE_FILTERS.map((g) => (
                  <button key={g.v} type="button" className={optClass(grade === g.v)} onClick={() => setGrade(g.v)}>
                    <ion-icon name={g.icon} style={{ fontSize: 13 }} />
                    {g.l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.6px', textTransform: 'uppercase', color: 'rgba(var(--ink),.5)', marginBottom: 10 }}>
                Trier par
              </div>
              <div className="row" style={{ gap: 8 }}>
                {([['pop', 'Populaires'], ['recent', 'Récents']] as const).map(([v, l]) => (
                  <button key={v} type="button" className={optClass(tri === v)} onClick={() => setTri(v)}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="chips-row kscroll" style={{ marginTop: 20 }}>
        {themes.map((t) => (
          <button key={t} type="button" className={`chip${chip === t ? ' active' : ''}`} onClick={() => setChip(t)}>
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="empty">Chargement des cercles…</p>
      ) : displayed.length === 0 ? (
        <div style={{ padding: '60px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 66, height: 66, borderRadius: 33, background: 'var(--field)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ion-icon name="compass-outline" style={{ fontSize: 32, color: 'rgba(var(--ink),.3)' }} />
          </div>
          <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 18 }}>Aucun cercle trouvé</div>
          <div style={{ fontSize: 14, color: 'rgba(var(--ink),.5)' }}>Essaie un autre thème ou ajuste tes filtres.</div>
          <button type="button" className="chip" style={{ marginTop: 4, padding: '11px 20px', color: 'var(--accent)', fontWeight: 600, fontSize: 13.5 }} onClick={resetAdv}>
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="kcards" style={{ marginTop: 22 }}>
          {displayed.map((c) => {
            const visual = themeVisual(c.theme)
            const g = gradeOf(c.niveau)
            return (
              <div
                key={c.id}
                style={{
                  background: 'var(--card)', borderRadius: 24, overflow: 'hidden', border: '1px solid var(--border)',
                  boxShadow: 'var(--cardShadow)', display: 'flex', flexDirection: 'column',
                }}
              >
                <button type="button" onClick={() => navigate(`/cercles/${c.id}`)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: 0 }}>
                  <div style={{ position: 'relative', height: 170, background: visual.gradient, overflow: 'hidden' }}>
                    <ion-icon
                      name={visual.icon}
                      style={{ position: 'absolute', right: -18, bottom: -26, fontSize: 158, color: 'rgba(255,255,255,.14)', transform: 'rotate(-10deg)' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(12,6,24,.05) 36%,rgba(12,6,24,.74))' }} />
                    <div
                      style={{
                        position: 'absolute', top: 14, left: 14, display: 'flex', alignItems: 'center', gap: 5,
                        padding: '5px 11px', borderRadius: 99, background: 'rgba(0,0,0,.32)', backdropFilter: 'blur(6px)',
                      }}
                    >
                      <ion-icon name={g.icon} style={{ fontSize: 12, color: g.color }} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{g.label}</span>
                    </div>
                    <div style={{ position: 'absolute', left: 18, right: 18, bottom: 15 }}>
                      {c.theme && (
                        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,.82)' }}>
                          {c.theme}
                        </span>
                      )}
                      <div style={{ marginTop: 3, fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 21, lineHeight: '25px', color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,.3)' }}>
                        {c.nom}
                      </div>
                    </div>
                  </div>
                </button>
                <div style={{ padding: '15px 17px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ fontSize: 13, lineHeight: '19px', color: 'rgba(var(--ink),.6)', flex: 1 }}>{c.description}</div>
                  {c.theme && (
                    <div className="row" style={{ marginTop: 13, flexWrap: 'wrap', gap: 6 }}>
                      <span className="hashtag">#{c.theme}</span>
                    </div>
                  )}
                  <div className="row between" style={{ marginTop: 14, gap: 12 }}>
                    <div className="row" style={{ gap: 6, minWidth: 0 }}>
                      <ion-icon name="people" style={{ fontSize: 16, color: 'rgba(var(--ink),.5)' }} />
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: 'rgba(var(--ink),.68)', whiteSpace: 'nowrap' }}>
                        {c.membres}/{c.capacite_max} membres
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => (c.rejoint ? navigate(`/cercles/${c.id}`) : join(c, e))}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 11, cursor: 'pointer', flexShrink: 0,
                        ...(c.rejoint
                          ? { background: 'var(--field)', border: '1px solid var(--border)' }
                          : { background: 'var(--brand)', boxShadow: '0 6px 12px rgba(224,42,115,.35)' }),
                      }}
                    >
                      <ion-icon name={c.rejoint ? 'arrow-forward' : 'add'} style={{ fontSize: 14, color: c.rejoint ? 'var(--accent)' : '#fff' }} />
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: c.rejoint ? 'var(--accent)' : '#fff' }}>
                        {c.rejoint ? 'Ouvrir' : 'Rejoindre'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
