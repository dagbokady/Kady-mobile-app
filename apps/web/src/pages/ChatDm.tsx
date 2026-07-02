import { useEffect, useRef, useState } from 'react'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { dm, relations as relationsApi } from '../api'
import { apiError, wsUrl } from '../api/client'
import type { Conversation, DmMessage, Relation } from '../api/types'
import { useAuth } from '../store/auth'
import { labelNiveau } from '../niveauLabels'
import { avatarGrad, heure, jourLabel } from '../visuals'
import { toast } from '../store/toast'
import QuizModal from '../components/QuizModal'
import LevelUpModal from '../components/LevelUpModal'

interface MessagesContext {
  reload: () => Promise<void>
}

export default function ChatDm() {
  const { id } = useParams<{ id: string }>()
  const me = useAuth((s) => s.me)
  const navigate = useNavigate()
  const { reload } = useOutletContext<MessagesContext>()
  const [conv, setConv] = useState<Conversation | null>(null)
  const [relation, setRelation] = useState<Relation | null>(null)
  const [messages, setMessages] = useState<DmMessage[]>([])
  const [texte, setTexte] = useState('')
  const [error, setError] = useState('')
  const [showQuiz, setShowQuiz] = useState(false)
  const [levelUp, setLevelUp] = useState<{ niveau: number; preview: boolean } | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    Promise.all([dm.messages(id), dm.conversations(), relationsApi.list()])
      .then(([msgs, convs, rels]) => {
        if (cancelled) return
        setMessages(msgs)
        const c = convs.find((x) => x.id === id) ?? null
        setConv(c)
        setRelation(c ? rels.find((r) => r.id === c.relation_id) ?? null : null)
      })
      .catch((err) => !cancelled && setError(apiError(err)))
    return () => {
      cancelled = true
    }
  }, [id])

  useEffect(() => {
    if (!id) return
    const ws = new WebSocket(wsUrl(`/dm/${id}/ws`))
    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data)
        if (payload.type === 'message') {
          setMessages((prev) => (prev.some((m) => m.id === payload.data.id) ? prev : [...prev, payload.data]))
        }
      } catch {
        /* ignore */
      }
    }
    return () => ws.close()
  }, [id])

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  async function envoyer(e?: React.FormEvent) {
    e?.preventDefault()
    if (!id) return
    if (!texte.trim()) {
      toast('Notes vocales — débloquées au niveau 3')
      return
    }
    const contenu = texte
    setTexte('')
    try {
      const msg = await dm.envoyer(id, contenu)
      setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]))
    } catch (err) {
      setError(apiError(err))
    }
  }

  async function envoyerEvaluation(moyenne: number, commentaire: string) {
    if (!relation) return
    try {
      const res = await relationsApi.evaluer(relation.id, moyenne, commentaire)
      setShowQuiz(false)
      toast(`Évaluation envoyée 🌟 +${Math.round(moyenne * 12)} XP pour ${conv?.prenom ?? 'votre lien'}`)
      setRelation((r) => (r ? { ...r, niveau: res.niveau, dm_ouvert: res.dm_ouvert } : r))
      setConv((c) => (c ? { ...c, niveau: res.niveau } : c))
      await reload()
      if (res.a_evolue) {
        setTimeout(() => setLevelUp({ niveau: res.niveau, preview: false }), 700)
      }
    } catch (err) {
      setShowQuiz(false)
      toast(apiError(err))
    }
  }

  const niveau = conv?.niveau ?? relation?.niveau ?? 1
  const mode = relation?.mode ?? 'rencontre'
  const nom = conv?.prenom ?? 'Conversation'
  const grad = avatarGrad(conv?.autre_id)

  let dernierJour = ''

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <div style={{ background: 'var(--glass)', backdropFilter: 'blur(14px)', borderBottom: '1px solid var(--border)', zIndex: 3 }}>
        <div className="row" style={{ gap: 11, padding: '12px 18px' }}>
          <button
            type="button"
            className="kmsg-back"
            onClick={() => navigate('/messages')}
            style={{ width: 34, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            aria-label="Retour"
          >
            <ion-icon name="chevron-back" style={{ fontSize: 24, color: 'var(--text)' }} />
          </button>
          <button
            type="button"
            onClick={() => conv && navigate(`/membre/${conv.autre_id}`)}
            style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 11, textAlign: 'left', minWidth: 0 }}
          >
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{ width: 44, height: 44, borderRadius: 22, background: grad, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 17, color: '#fff' }}>
                  {nom[0]?.toUpperCase()}
                </span>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 16 }}>{nom}</div>
              <div style={{ marginTop: 1, fontSize: 12, fontWeight: 600, color: 'rgba(var(--ink),.45)' }}>
                {labelNiveau(mode, niveau)}
              </div>
            </div>
          </button>
          <button className="icon-btn" type="button" style={{ width: 40, height: 40, borderRadius: 12, border: 'none' }} onClick={() => setShowQuiz(true)} aria-label="Évaluer">
            <ion-icon name="star-outline" style={{ fontSize: 19, color: '#ffb43a' }} />
          </button>
          <button
            className="icon-btn"
            type="button"
            style={{ width: 40, height: 40, borderRadius: 12, border: 'none' }}
            onClick={() =>
              toast(niveau >= 5 ? 'Appels vidéo — bientôt disponibles' : `Appel vidéo verrouillé — niveau « ${labelNiveau(mode, 5)} »`)
            }
            aria-label="Appel vidéo"
          >
            <ion-icon name="videocam-outline" style={{ fontSize: 20, color: 'var(--accent)' }} />
          </button>
          <button
            className="icon-btn"
            type="button"
            style={{ width: 40, height: 40, borderRadius: 12, border: 'none' }}
            onClick={() =>
              toast(niveau >= 4 ? 'Appels audio — bientôt disponibles' : `Appel audio verrouillé — niveau « ${labelNiveau(mode, 4)} »`)
            }
            aria-label="Appel audio"
          >
            <ion-icon name="call-outline" style={{ fontSize: 19, color: 'var(--accent)' }} />
          </button>
        </div>

        <div style={{ padding: '0 18px 13px' }}>
          <div className="row between" style={{ marginBottom: 6 }}>
            <div className="row" style={{ gap: 6 }}>
              <ion-icon name="heart" style={{ fontSize: 12, color: 'var(--accent)' }} />
              <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--accent)' }}>
                Niveau {niveau} · {labelNiveau(mode, niveau)}
              </span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(var(--ink),.45)' }}>Niveau {niveau}/5</span>
          </div>
          <div style={{ display: 'flex', gap: 5 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} style={{ flex: 1, height: 6, borderRadius: 99, background: i < niveau ? 'var(--brand)' : 'rgba(var(--ink),.12)' }} />
            ))}
          </div>
          {niveau < 5 && (
            <div className="row" style={{ marginTop: 10, gap: 8 }}>
              <button
                type="button"
                onClick={() => setShowQuiz(true)}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 9,
                  borderRadius: 11, background: 'var(--field)', border: '1px solid var(--border)',
                }}
              >
                <ion-icon name="star-outline" style={{ fontSize: 14, color: '#ffb43a' }} />
                <span style={{ fontSize: 12, fontWeight: 700 }}>Évaluer</span>
              </button>
              <button
                type="button"
                onClick={() => setLevelUp({ niveau: niveau + 1, preview: true })}
                style={{
                  flex: 1.4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 9,
                  borderRadius: 11, background: 'linear-gradient(135deg,rgba(255,106,169,.16),rgba(143,157,255,.12))',
                  border: '1px solid rgba(255,140,190,.4)',
                }}
              >
                <ion-icon name="trending-up" style={{ fontSize: 14, color: 'var(--accentDeep)' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accentDeep)' }}>Passer au niveau {niveau + 1}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div style={{ padding: '10px 18px' }}>
          <div className="error-banner">{error}</div>
        </div>
      )}

      <div ref={scrollRef} className="kscroll chat-scroll-bg" style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          {conv && (
            <button
              type="button"
              onClick={() => navigate(`/membre/${conv.autre_id}`)}
              style={{
                display: 'flex', width: '100%', marginBottom: 18, alignItems: 'center', gap: 12, padding: '13px 15px',
                borderRadius: 16, background: 'linear-gradient(135deg,rgba(255,106,169,.12),rgba(143,157,255,.08))',
                border: '1px solid rgba(255,140,190,.28)', textAlign: 'left',
              }}
            >
              <div
                style={{
                  width: 38, height: 38, borderRadius: 12, background: 'var(--brand)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0, boxShadow: '0 6px 12px rgba(224,42,115,.35)',
                }}
              >
                <ion-icon name="sparkles" style={{ fontSize: 19, color: '#fff' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>À découvrir sur {nom}</div>
                <div style={{ marginTop: 1, fontSize: 11.5, color: 'rgba(var(--ink),.55)' }}>
                  Devine ce que tu apprends sur {nom} →
                </div>
              </div>
              <ion-icon name="chevron-forward" style={{ fontSize: 18, color: 'var(--accent)', flexShrink: 0 }} />
            </button>
          )}

          {messages.map((m) => {
            const mine = m.auteur_id === me?.id
            const jour = jourLabel(m.created_at)
            const sep = jour !== dernierJour
            dernierJour = jour
            return (
              <div key={m.id}>
                {sep && (
                  <div className="chat-day">
                    <span>{jour}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
                  <div className={mine ? 'bubble-out' : 'bubble-in'}>
                    <div style={{ fontSize: 14.5, lineHeight: '21px', color: mine ? 'var(--outText)' : 'var(--text)' }}>{m.contenu}</div>
                    <div style={{ marginTop: 3, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                      <span style={{ fontSize: 10, color: 'rgba(var(--ink),.42)' }}>{heure(m.created_at)}</span>
                      {mine && <ion-icon name="checkmark-done" style={{ fontSize: 14, color: m.lu ? 'var(--accent)' : 'rgba(var(--ink),.35)' }} />}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          {messages.length === 0 && <div className="empty">Dites-vous bonjour 👋</div>}
        </div>
      </div>

      <form className="composer-bar" onSubmit={envoyer}>
        <div className="composer-inner">
          <div className="composer-field">
            <ion-icon name="happy-outline" style={{ fontSize: 22 }} />
            <input
              className="kinput"
              value={texte}
              onChange={(e) => setTexte(e.target.value)}
              placeholder="Écris un message…"
              style={{ padding: '5px 0' }}
            />
            <button type="button" onClick={() => toast(`Partage de photos — niveau « ${labelNiveau(mode, 4)} »`)} style={{ display: 'flex' }} aria-label="Photo">
              <ion-icon name="image-outline" style={{ fontSize: 21, color: 'rgba(var(--ink),.45)' }} />
            </button>
            <button type="button" onClick={() => toast('Pièces jointes — bientôt disponibles')} style={{ display: 'flex' }} aria-label="Pièce jointe">
              <ion-icon name="attach" style={{ fontSize: 22, color: 'rgba(var(--ink),.45)' }} />
            </button>
          </div>
          <button className="composer-send" type="submit" aria-label="Envoyer">
            <ion-icon name={texte.trim() ? 'send' : 'mic'} />
          </button>
        </div>
      </form>

      {showQuiz && <QuizModal name={nom} onClose={() => setShowQuiz(false)} onSubmit={envoyerEvaluation} />}
      {levelUp && (
        <LevelUpModal
          name={nom}
          initial={nom[0]?.toUpperCase() ?? '?'}
          grad={grad}
          mode={mode}
          niveau={levelUp.niveau}
          preview={levelUp.preview}
          onClose={() => setLevelUp(null)}
        />
      )}
    </div>
  )
}
