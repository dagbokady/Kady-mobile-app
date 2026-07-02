import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { cercles as cerclesApi } from '../api'
import { apiError, wsUrl } from '../api/client'
import type { Cercle as CercleT, CercleMessage, Membre } from '../api/types'
import { useAuth } from '../store/auth'
import { themeVisual } from '../themeVisual'
import { avatarGrad, heure, jourLabel } from '../visuals'

export default function CercleChat() {
  const { id } = useParams<{ id: string }>()
  const me = useAuth((s) => s.me)
  const navigate = useNavigate()
  const [cercle, setCercle] = useState<CercleT | null>(null)
  const [membres, setMembres] = useState<Membre[]>([])
  const [messages, setMessages] = useState<CercleMessage[]>([])
  const [texte, setTexte] = useState('')
  const [error, setError] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    Promise.all([cerclesApi.get(id), cerclesApi.membres(id), cerclesApi.messages(id)])
      .then(([c, ms, msgs]) => {
        if (cancelled) return
        setCercle(c)
        setMembres(ms)
        setMessages(msgs)
      })
      .catch((err) => !cancelled && setError(apiError(err)))
    return () => {
      cancelled = true
    }
  }, [id])

  useEffect(() => {
    if (!id) return
    const ws = new WebSocket(wsUrl(`/cercles/${id}/ws`))
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
    if (!id || !texte.trim()) return
    const contenu = texte
    setTexte('')
    try {
      const msg = await cerclesApi.envoyer(id, contenu)
      setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]))
    } catch (err) {
      setError(apiError(err))
    }
  }

  const nomDe = new Map(membres.map((m) => [m.user_id, m.prenom ?? 'Membre']))
  const visual = themeVisual(cercle?.theme)
  const enLigne = membres.filter((m) => m.en_ligne).length

  let dernierJour = ''

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 67px)', background: 'var(--chatBg)' }}>
      <div style={{ background: 'var(--glass)', backdropFilter: 'blur(14px)', borderBottom: '1px solid var(--border)', zIndex: 3 }}>
        <div className="row" style={{ gap: 11, padding: '12px 18px' }}>
          <button type="button" onClick={() => navigate(`/cercles/${id}`)} style={{ width: 34, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Retour">
            <ion-icon name="chevron-back" style={{ fontSize: 24, color: 'var(--text)' }} />
          </button>
          <div
            style={{
              width: 44, height: 44, borderRadius: 14, background: visual.gradient, display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            <ion-icon name={visual.icon} style={{ fontSize: 20, color: '#fff' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 16 }}>{cercle?.nom ?? 'Cercle'}</div>
            <div style={{ marginTop: 1, fontSize: 12, fontWeight: 600, color: enLigne > 0 ? '#43a35a' : 'rgba(var(--ink),.45)' }}>
              {membres.length} membres{enLigne > 0 ? ` · ${enLigne} en ligne` : ''}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div style={{ padding: '10px 18px' }}>
          <div className="error-banner">{error}</div>
        </div>
      )}

      <div ref={scrollRef} className="kscroll chat-scroll-bg" style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
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
                <div style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start', marginBottom: 10, gap: 8 }}>
                  {!mine && (
                    <div
                      style={{
                        width: 30, height: 30, borderRadius: 15, background: avatarGrad(m.auteur_id), flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end',
                        fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 12, color: '#fff',
                      }}
                    >
                      {(nomDe.get(m.auteur_id) ?? '?')[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className={mine ? 'bubble-out' : 'bubble-in'}>
                    {!mine && (
                      <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--accent)', marginBottom: 2 }}>
                        {nomDe.get(m.auteur_id) ?? 'Membre'}
                      </div>
                    )}
                    <div style={{ fontSize: 14.5, lineHeight: '21px', color: mine ? 'var(--outText)' : 'var(--text)' }}>{m.contenu}</div>
                    <div style={{ marginTop: 3, textAlign: 'right', fontSize: 10, color: 'rgba(var(--ink),.4)' }}>{heure(m.created_at)}</div>
                  </div>
                </div>
              </div>
            )
          })}
          {messages.length === 0 && <div className="empty">Lance la conversation du cercle 👋</div>}
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
              placeholder="Écris au cercle…"
              style={{ padding: '5px 0' }}
            />
          </div>
          <button className="composer-send" type="submit" aria-label="Envoyer">
            <ion-icon name="send" />
          </button>
        </div>
      </form>
    </div>
  )
}
