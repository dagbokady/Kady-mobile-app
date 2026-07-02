import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { cercles as cerclesApi, relations as relationsApi } from '../api'
import { apiError } from '../api/client'
import type { Cercle as CercleT, Membre, Relation } from '../api/types'
import { useAuth } from '../store/auth'
import { themeVisual } from '../themeVisual'
import { avatarGrad, gradeByName, gradeOf } from '../visuals'
import { toast } from '../store/toast'

export default function Cercle() {
  const { id } = useParams<{ id: string }>()
  const me = useAuth((s) => s.me)
  const navigate = useNavigate()
  const [cercle, setCercle] = useState<CercleT | null>(null)
  const [membres, setMembres] = useState<Membre[]>([])
  const [relations, setRelations] = useState<Relation[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    let cancelled = false
    async function load() {
      try {
        const c = await cerclesApi.get(id!)
        if (cancelled) return
        setCercle(c)
        if (c.rejoint) {
          const [ms, rels] = await Promise.all([cerclesApi.membres(id!), relationsApi.list()])
          if (cancelled) return
          setMembres(ms)
          setRelations(rels)
        }
      } catch (err) {
        if (!cancelled) setError(apiError(err))
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [id])

  async function join() {
    if (!id) return
    try {
      await cerclesApi.join(id)
      const [c, ms, rels] = await Promise.all([cerclesApi.get(id), cerclesApi.membres(id), relationsApi.list()])
      setCercle(c)
      setMembres(ms)
      setRelations(rels)
      toast('Cercle rejoint ✓')
    } catch (err) {
      setError(apiError(err))
    }
  }

  async function leave() {
    if (!id) return
    try {
      await cerclesApi.leave(id)
      toast('Tu as quitté le cercle')
      navigate('/decouvrir')
    } catch (err) {
      setError(apiError(err))
    }
  }

  async function inviter() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast('Lien du cercle copié ✓')
    } catch {
      toast(window.location.href)
    }
  }

  if (!cercle) return <p className="empty">{error || 'Chargement…'}</p>

  const visual = themeVisual(cercle.theme)
  const g = gradeOf(cercle.niveau)
  const enLigne = membres.filter((m) => m.en_ligne).length
  const relByAutre = new Map(relations.map((r) => [r.autre_id, r]))
  const autres = membres.filter((m) => m.user_id !== me?.id)

  return (
    <div style={{ animation: 'kfade .3s ease' }}>
      {/* Hero pleine largeur */}
      <div style={{ position: 'relative', height: 300, background: visual.gradient, overflow: 'hidden' }}>
        <ion-icon
          name={visual.icon}
          style={{ position: 'absolute', right: -20, bottom: -30, fontSize: 220, color: 'rgba(255,255,255,.14)', transform: 'rotate(-10deg)' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(10,6,20,.28),transparent 40%,rgba(10,6,20,.66))' }} />
        <div
          className="kwrap"
          style={{
            position: 'relative', height: '100%', display: 'flex', flexDirection: 'column',
            justifyContent: 'space-between', paddingTop: 20, paddingBottom: 24,
          }}
        >
          <button type="button" className="glass-chip" style={{ alignSelf: 'flex-start' }} onClick={() => navigate('/decouvrir')}>
            <ion-icon name="chevron-back" style={{ fontSize: 18 }} />
            Découvrir
          </button>
          <div>
            <div className="row" style={{ gap: 8, marginBottom: 12 }}>
              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 99,
                  background: 'rgba(255,210,122,.22)', border: '1px solid rgba(255,210,122,.4)',
                }}
              >
                <ion-icon name={g.icon} style={{ fontSize: 12, color: '#ffd27a' }} />
                <span style={{ fontSize: 11.5, fontWeight: 700, color: '#ffe7b0' }}>{g.label}</span>
              </div>
              {cercle.statut === 'actif' && (
                <div
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 99,
                    background: 'rgba(255,255,255,.16)', border: '1px solid rgba(255,255,255,.22)',
                  }}
                >
                  <div style={{ width: 6, height: 6, borderRadius: 3, background: '#43e08a' }} />
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: '#fff' }}>Actif</span>
                </div>
              )}
            </div>
            <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 38, color: '#fff', textShadow: '0 2px 14px rgba(0,0,0,.45)' }}>
              {cercle.nom}
            </div>
            <div className="row" style={{ marginTop: 8, gap: 8, flexWrap: 'wrap' }}>
              {cercle.theme && <span style={{ fontSize: 14, color: 'rgba(255,255,255,.88)' }}>{cercle.theme}</span>}
              {cercle.theme && <span style={{ color: 'rgba(255,255,255,.5)' }}>·</span>}
              <ion-icon name="people" style={{ fontSize: 14, color: 'rgba(255,255,255,.88)' }} />
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,.88)' }}>
                {cercle.membres}/{cercle.capacite_max} membres
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="kwrap kdash" style={{ padding: '30px 28px 70px' }}>
        <div>
          {error && <div className="error-banner" style={{ marginBottom: 16 }}>{error}</div>}

          {cercle.rejoint && autres.length > 0 && (
            <div className="row" style={{ gap: 12 }}>
              <div style={{ display: 'flex' }}>
                {autres.slice(0, 3).map((m, i) => (
                  <div
                    key={m.user_id}
                    style={{
                      width: 36, height: 36, borderRadius: 18, border: '2.5px solid var(--bg2)',
                      background: avatarGrad(m.user_id), marginLeft: i > 0 ? -12 : 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 13, color: '#fff',
                    }}
                  >
                    {(m.prenom ?? '?')[0]?.toUpperCase()}
                  </div>
                ))}
                {autres.length > 3 && (
                  <div
                    style={{
                      width: 36, height: 36, borderRadius: 18, border: '2.5px solid var(--bg2)', background: 'var(--card2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: -12,
                    }}
                  >
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)' }}>+{autres.length - 3}</span>
                  </div>
                )}
              </div>
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 700 }}>{cercle.membres} membres</div>
                <div style={{ fontSize: 12, color: 'rgba(var(--ink),.45)' }}>{enLigne} en ligne</div>
              </div>
            </div>
          )}

          {cercle.description && (
            <div style={{ marginTop: 18, fontSize: 15, lineHeight: '23px', color: 'rgba(var(--ink),.72)' }}>{cercle.description}</div>
          )}
          {cercle.theme && (
            <div className="row" style={{ marginTop: 16, flexWrap: 'wrap', gap: 8 }}>
              <div style={{ padding: '7px 14px', borderRadius: 99, background: 'var(--field)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: 'rgba(var(--ink),.7)' }}>#{cercle.theme}</span>
              </div>
            </div>
          )}

          {cercle.rejoint ? (
            <>
              <div className="row" style={{ marginTop: 28, gap: 10, marginBottom: 14 }}>
                <ion-icon name="people-outline" style={{ fontSize: 19, color: 'var(--accent)' }} />
                <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 18 }}>Membres</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {membres.map((m) => {
                  const moi = m.user_id === me?.id
                  const rel = relByAutre.get(m.user_id)
                  const grade = gradeByName(m.grade)
                  const row = (
                    <>
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <div
                          style={{
                            width: 46, height: 46, borderRadius: 23, background: avatarGrad(m.user_id),
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 17, color: '#fff' }}>
                            {(m.prenom ?? '?')[0]?.toUpperCase()}
                          </span>
                        </div>
                        {m.en_ligne && (
                          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 11, height: 11, borderRadius: 6, background: '#43e08a', border: '2px solid var(--bg2)' }} />
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14.5, fontWeight: 700 }}>
                          {m.prenom ?? 'Membre'}
                          {moi ? ' (toi)' : ''}
                        </div>
                        <div style={{ marginTop: 1, fontSize: 12, color: 'rgba(var(--ink),.5)' }}>
                          {m.role === 'fondateur' ? 'Fondateur' : 'Membre'} · {grade.label}
                        </div>
                      </div>
                      {rel && (
                        <div
                          style={{
                            display: 'flex', alignItems: 'center', gap: 4, padding: '5px 11px', borderRadius: 99,
                            background: 'rgba(255,111,168,.14)', border: '1px solid rgba(255,111,168,.3)',
                          }}
                        >
                          <ion-icon name="heart" style={{ fontSize: 10, color: '#ff6fa8' }} />
                          <span style={{ fontSize: 10.5, fontWeight: 700, color: '#ff6fa8' }}>Lien</span>
                        </div>
                      )}
                      {!moi && <ion-icon name="chevron-forward" style={{ fontSize: 17, color: 'rgba(var(--ink),.3)' }} />}
                    </>
                  )
                  return moi ? (
                    <div key={m.user_id} className="row" style={{ gap: 13, padding: '11px 12px', borderRadius: 14 }}>
                      {row}
                    </div>
                  ) : (
                    <button
                      key={m.user_id}
                      type="button"
                      className="row"
                      style={{ gap: 13, padding: '11px 12px', borderRadius: 14, textAlign: 'left', width: '100%' }}
                      onClick={() => navigate(`/membre/${m.user_id}`)}
                    >
                      {row}
                    </button>
                  )
                })}
              </div>
            </>
          ) : (
            <div className="card" style={{ marginTop: 24, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <ion-icon name="lock-closed" style={{ fontSize: 18, color: 'rgba(var(--ink),.4)', marginTop: 2 }} />
              <span style={{ fontSize: 13.5, lineHeight: '20px', color: 'rgba(var(--ink),.6)' }}>
                Tu es dans la <b style={{ color: 'var(--text)' }}>salle d'accueil</b>. Rejoins le cercle pour découvrir les membres et participer au chat.
              </span>
            </div>
          )}
        </div>

        {/* Sidebar sticky */}
        <div className="kdash-side" style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 88 }}>
          <div style={{ padding: 20, borderRadius: 20, background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--cardShadow)' }}>
            {cercle.rejoint ? (
              <>
                <button className="btn btn-primary" type="button" style={{ width: '100%', padding: 15 }} onClick={() => navigate(`/cercles/${id}/chat`)}>
                  <ion-icon name="chatbubble-ellipses-outline" style={{ fontSize: 18 }} />
                  Ouvrir le chat du cercle
                </button>
                <button className="btn btn-soft" type="button" style={{ marginTop: 11, width: '100%', padding: 14 }} onClick={inviter}>
                  <ion-icon name="person-add-outline" style={{ fontSize: 17 }} />
                  Inviter
                </button>
              </>
            ) : (
              <button className="btn btn-primary" type="button" style={{ width: '100%', padding: 15 }} onClick={join}>
                <ion-icon name="add" style={{ fontSize: 18 }} />
                Rejoindre le cercle
              </button>
            )}
          </div>

          <div
            style={{
              padding: 18, borderRadius: 18, border: '1px solid rgba(255,140,190,.2)',
              background: 'linear-gradient(135deg,rgba(255,106,169,.12),rgba(255,111,194,.06))',
            }}
          >
            <div className="row between" style={{ marginBottom: 11 }}>
              <div className="row" style={{ gap: 7 }}>
                <ion-icon name="flash" style={{ fontSize: 15, color: 'var(--accent)' }} />
                <span style={{ fontSize: 13.5, fontWeight: 700 }}>Niveau du cercle {cercle.niveau}</span>
              </div>
              <span style={{ fontSize: 12, color: 'rgba(var(--ink),.6)' }}>
                <b style={{ color: 'var(--text)' }}>{g.label}</b>
              </span>
            </div>
            <div style={{ height: 9, borderRadius: 99, background: 'rgba(var(--ink),.12)', overflow: 'hidden' }}>
              <div style={{ width: `${(cercle.niveau / 5) * 100}%`, height: '100%', background: 'var(--brand)', borderRadius: 99 }} />
            </div>
            <div style={{ marginTop: 11, fontSize: 12, color: 'rgba(var(--ink),.55)' }}>
              L'activité du cercle fait grandir son grade, de <b style={{ color: 'var(--accentDeep)' }}>Graine</b> à{' '}
              <b style={{ color: 'var(--accentDeep)' }}>Légendaire</b>.
            </div>
          </div>

          {cercle.rejoint && (
            <button className="btn btn-danger" type="button" style={{ width: '100%', padding: 13, fontSize: 13.5, fontWeight: 600 }} onClick={leave}>
              Quitter le cercle
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
