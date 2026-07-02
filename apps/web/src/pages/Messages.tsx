import { useEffect, useState } from 'react'
import { Outlet, useMatch, useNavigate, useParams } from 'react-router-dom'
import { dm, relations as relationsApi } from '../api'
import { apiError } from '../api/client'
import type { Conversation, Relation } from '../api/types'
import { labelNiveau } from '../niveauLabels'
import { avatarGrad, modeColor, modeLabel } from '../visuals'
import { toast } from '../store/toast'
import QuizModal from '../components/QuizModal'
import LevelUpModal from '../components/LevelUpModal'

const CHIPS = ['Tous', 'Rencontre', 'Amitié'] as const

export default function Messages() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [relations, setRelations] = useState<Relation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [chip, setChip] = useState<(typeof CHIPS)[number]>('Tous')
  const [quizFor, setQuizFor] = useState<Relation | null>(null)
  const [levelUp, setLevelUp] = useState<{ rel: Relation; niveau: number } | null>(null)
  const navigate = useNavigate()
  const { id: activeId } = useParams<{ id: string }>()
  const isChatOpen = !!useMatch('/messages/:id')

  async function load() {
    try {
      const [convs, rels] = await Promise.all([dm.conversations(), relationsApi.list()])
      setConversations(convs)
      setRelations(rels)
    } catch (err) {
      setError(apiError(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const relById = new Map(relations.map((r) => [r.id, r]))
  const conversationRelationIds = new Set(conversations.map((c) => c.relation_id))
  const ouvrables = relations.filter((r) => r.dm_ouvert && !conversationRelationIds.has(r.id))
  const enConstruction = relations.filter((r) => !r.dm_ouvert)

  const q = search.trim().toLowerCase()
  const convs = conversations.filter((c) => {
    const rel = relById.get(c.relation_id)
    if (chip === 'Rencontre' && rel?.mode !== 'rencontre') return false
    if (chip === 'Amitié' && rel?.mode !== 'amitie') return false
    if (q && !(c.prenom ?? '').toLowerCase().includes(q)) return false
    return true
  })

  async function ouvrir(relationId: string) {
    try {
      const conv = await dm.ouvrir(relationId)
      setConversations((prev) => (prev.some((c) => c.id === conv.id) ? prev : [...prev, conv]))
      navigate(`/messages/${conv.id}`)
    } catch (err) {
      setError(apiError(err))
    }
  }

  async function envoyerEvaluation(rel: Relation, moyenne: number, commentaire: string) {
    try {
      const res = await relationsApi.evaluer(rel.id, moyenne, commentaire)
      setQuizFor(null)
      toast(`Évaluation envoyée 🌟 +${Math.round(moyenne * 12)} XP pour ${rel.prenom ?? 'votre lien'}`)
      await load()
      if (res.a_evolue) {
        setTimeout(() => setLevelUp({ rel, niveau: res.niveau }), 700)
      }
    } catch (err) {
      setQuizFor(null)
      toast(apiError(err))
    }
  }

  return (
    <div className="kmsg-grid" data-mview={isChatOpen ? 'chat' : 'list'}>
      <div className="kmsg-list kscroll" style={{ overflowY: 'auto', borderRight: '1px solid var(--border)', background: 'var(--bg1)' }}>
        <div style={{ position: 'sticky', top: 0, zIndex: 3, background: 'var(--bg1)', padding: '18px 18px 12px', borderBottom: '1px solid var(--border)' }}>
          <div className="row between">
            <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 24, letterSpacing: '-.4px' }}>Messages</span>
            <button
              className="icon-btn"
              type="button"
              style={{ width: 40, height: 40 }}
              onClick={() => navigate('/decouvrir')}
              aria-label="Découvrir des cercles"
            >
              <ion-icon name="create-outline" />
            </button>
          </div>
          <div className="field-box" style={{ marginTop: 13, padding: '10px 13px', borderRadius: 12 }}>
            <ion-icon name="search" />
            <input className="input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher" style={{ fontSize: 14 }} />
            {search && (
              <button type="button" onClick={() => setSearch('')} style={{ display: 'flex' }} aria-label="Effacer">
                <ion-icon name="close-circle" style={{ fontSize: 17, color: 'rgba(var(--ink),.35)' }} />
              </button>
            )}
          </div>
          <div className="chips-row kscroll" style={{ marginTop: 12 }}>
            {CHIPS.map((c) => (
              <button key={c} type="button" className={`chip${chip === c ? ' active' : ''}`} style={{ padding: '8px 15px', fontSize: 12.5 }} onClick={() => setChip(c)}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: '6px 4px 20px' }}>
          {error && <div className="error-banner" style={{ margin: '10px 14px' }}>{error}</div>}
          {loading ? (
            <p className="empty">Chargement…</p>
          ) : (
            <>
              {convs.map((c) => {
                const rel = relById.get(c.relation_id)
                const active = activeId === c.id
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => navigate(`/messages/${c.id}`)}
                    style={{
                      width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 13,
                      padding: '11px 14px', cursor: 'pointer',
                      borderLeft: `3px solid ${active ? 'var(--accent)' : 'transparent'}`,
                      background: active ? 'var(--field)' : 'transparent',
                    }}
                  >
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <div
                        style={{
                          width: 52, height: 52, borderRadius: 26, background: avatarGrad(c.autre_id),
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 18, color: '#fff' }}>
                          {(c.prenom ?? '?')[0]?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="row between" style={{ gap: 8 }}>
                        <span style={{ fontSize: 15, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {c.prenom ?? 'Anonyme'}
                        </span>
                      </div>
                      <div className="row between" style={{ marginTop: 3, gap: 8 }}>
                        <span style={{ fontSize: 13, color: 'rgba(var(--ink),.5)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {labelNiveau(rel?.mode ?? 'rencontre', c.niveau)} · Niveau {c.niveau}
                        </span>
                        <span style={{ fontSize: 10.5, fontWeight: 600, color: modeColor(rel?.mode), flexShrink: 0 }}>
                          {modeLabel(rel?.mode)}
                        </span>
                      </div>
                    </div>
                  </button>
                )
              })}

              {convs.length === 0 && (
                <div style={{ padding: '48px 20px', textAlign: 'center' }}>
                  <ion-icon name="search-outline" style={{ fontSize: 34, color: 'rgba(var(--ink),.25)' }} />
                  <div style={{ marginTop: 10, fontSize: 13.5, color: 'rgba(var(--ink),.45)' }}>Aucune conversation</div>
                </div>
              )}

              {ouvrables.length > 0 && (
                <div style={{ padding: '12px 14px 0' }}>
                  <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.6px', textTransform: 'uppercase', color: 'rgba(var(--ink),.5)', marginBottom: 8 }}>
                    Prêts pour le DM
                  </div>
                  {ouvrables.map((r) => (
                    <div key={r.id} className="row between" style={{ padding: '9px 0', gap: 10 }}>
                      <div className="row" style={{ gap: 10, minWidth: 0 }}>
                        <div className="avatar" style={{ width: 38, height: 38, fontSize: 14, background: avatarGrad(r.autre_id) }}>
                          {(r.prenom ?? '?')[0]?.toUpperCase()}
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {r.prenom ?? 'Anonyme'}
                        </span>
                      </div>
                      <button className="btn btn-primary btn-sm" type="button" onClick={() => ouvrir(r.id)}>
                        Ouvrir
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {enConstruction.length > 0 && (
                <div style={{ padding: '12px 14px 0' }}>
                  <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.6px', textTransform: 'uppercase', color: 'rgba(var(--ink),.5)', marginBottom: 8 }}>
                    Liens en construction
                  </div>
                  {enConstruction.map((r) => (
                    <div key={r.id} className="row between" style={{ padding: '9px 0', gap: 10 }}>
                      <button className="row" type="button" style={{ gap: 10, minWidth: 0, textAlign: 'left' }} onClick={() => navigate(`/membre/${r.autre_id}`)}>
                        <div className="avatar" style={{ width: 38, height: 38, fontSize: 14, background: avatarGrad(r.autre_id) }}>
                          {(r.prenom ?? '?')[0]?.toUpperCase()}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {r.prenom ?? 'Anonyme'}
                          </div>
                          <div style={{ fontSize: 11.5, color: 'rgba(var(--ink),.45)' }}>{labelNiveau(r.mode, r.niveau)}</div>
                        </div>
                      </button>
                      <button className="btn btn-ghost btn-sm" type="button" onClick={() => setQuizFor(r)}>
                        <ion-icon name="star-outline" style={{ fontSize: 14, color: '#ffb43a' }} />
                        Évaluer
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="kmsg-chat">
        <Outlet context={{ reload: load }} />
      </div>

      {quizFor && (
        <QuizModal
          name={quizFor.prenom ?? 'ce membre'}
          onClose={() => setQuizFor(null)}
          onSubmit={(moyenne, commentaire) => envoyerEvaluation(quizFor, moyenne, commentaire)}
        />
      )}
      {levelUp && (
        <LevelUpModal
          name={levelUp.rel.prenom ?? 'vous deux'}
          initial={(levelUp.rel.prenom ?? '?')[0]?.toUpperCase() ?? '?'}
          grad={avatarGrad(levelUp.rel.autre_id)}
          mode={levelUp.rel.mode}
          niveau={levelUp.niveau}
          onClose={() => setLevelUp(null)}
        />
      )}
    </div>
  )
}
