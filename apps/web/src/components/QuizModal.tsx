import { useState } from 'react'
import { toast } from '../store/toast'

const CRITERIA = [
  { key: 'respect', label: 'Respect', desc: 'Bienveillant·e et courtois·e', icon: 'heart', tint: '#ff6fa8' },
  { key: 'ecoute', label: 'Écoute', desc: 'Attentif·ve à ce que tu partages', icon: 'chatbubbles', tint: '#5a7fd6' },
  { key: 'authenticite', label: 'Authenticité', desc: 'Vrai·e, sans faux-semblants', icon: 'sparkles', tint: '#a463ff' },
  { key: 'reactivite', label: 'Réactivité', desc: 'Répond dans de bons délais', icon: 'time', tint: '#2fb8c0' },
  { key: 'energie', label: 'Bonne énergie', desc: 'Agréable et positif·ve', icon: 'sunny', tint: '#ffb43a' },
]

const MOODS = [
  { e: '😍', l: 'Au top' },
  { e: '🙂', l: 'Sympa' },
  { e: '😐', l: 'Mitigé' },
  { e: '😕', l: 'Bof' },
]

interface Props {
  name: string
  onClose: () => void
  onSubmit: (moyenne: number, commentaire: string) => Promise<void> | void
}

/** Quiz d'évaluation d'un lien : 5 critères notés /5, puis ressenti + commentaire. */
export default function QuizModal({ name, onClose, onSubmit }: Props) {
  const [step, setStep] = useState(0)
  const [ratings, setRatings] = useState<Record<string, number>>({})
  const [mood, setMood] = useState<string | null>(null)
  const [comment, setComment] = useState('')
  const [busy, setBusy] = useState(false)

  async function next() {
    if (step === 0) {
      if (!CRITERIA.every((c) => (ratings[c.key] || 0) > 0)) {
        toast('Note chaque critère pour continuer')
        return
      }
      setStep(1)
      return
    }
    const vals = CRITERIA.map((c) => ratings[c.key] || 0)
    const moyenne = vals.reduce((a, b) => a + b, 0) / vals.length
    setBusy(true)
    try {
      await onSubmit(Math.round(moyenne * 100) / 100, mood ? `${mood}${comment ? ` — ${comment}` : ''}` : comment)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel kscroll" onClick={(e) => e.stopPropagation()}>
        <div className="row between" style={{ padding: '22px 24px 16px', borderBottom: '1px solid var(--border)', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 18 }}>Évaluer {name}</div>
            <div style={{ marginTop: 2, fontSize: 12.5, color: 'rgba(var(--ink),.5)' }}>Ton avis renforce la confiance du lien.</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ width: 36, height: 36, borderRadius: 11, background: 'var(--field)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            aria-label="Fermer"
          >
            <ion-icon name="close" style={{ fontSize: 19, color: 'var(--text)' }} />
          </button>
        </div>

        <div style={{ padding: '20px 24px 24px' }}>
          {step === 0 ? (
            <div className="stack" style={{ gap: 16 }}>
              {CRITERIA.map((c) => (
                <div key={c.key} className="row" style={{ gap: 13 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 13, background: 'var(--field)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <ion-icon name={c.icon} style={{ fontSize: 20, color: c.tint }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{c.label}</div>
                    <div style={{ marginTop: 1, fontSize: 11.5, color: 'rgba(var(--ink),.5)' }}>{c.desc}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
                    {[1, 2, 3, 4, 5].map((n) => {
                      const on = n <= (ratings[c.key] || 0)
                      return (
                        <button key={n} type="button" onClick={() => setRatings((r) => ({ ...r, [c.key]: n }))} aria-label={`${n} étoiles`}>
                          <ion-icon name={on ? 'star' : 'star-outline'} style={{ fontSize: 22, color: on ? '#ffb43a' : 'rgba(var(--ink),.25)' }} />
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 12 }}>Ton ressenti global</div>
              <div className="row" style={{ gap: 9 }}>
                {MOODS.map((m) => (
                  <button
                    key={m.l}
                    type="button"
                    onClick={() => setMood(m.l)}
                    style={{
                      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '13px 6px',
                      borderRadius: 14, cursor: 'pointer',
                      border: `1.5px solid ${mood === m.l ? 'var(--accent)' : 'var(--border)'}`,
                      background: mood === m.l ? 'rgba(214,40,110,.08)' : 'var(--field)',
                    }}
                  >
                    <span style={{ fontSize: 26 }}>{m.e}</span>
                    <span style={{ fontSize: 11.5, fontWeight: 600 }}>{m.l}</span>
                  </button>
                ))}
              </div>
              <div style={{ marginTop: 20, fontSize: 13.5, fontWeight: 700, marginBottom: 10 }}>
                Un mot à ajouter ? <span style={{ fontWeight: 500, color: 'rgba(var(--ink),.45)' }}>(optionnel)</span>
              </div>
              <textarea
                className="kinput"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ce que tu as apprécié…"
                style={{
                  width: '100%', minHeight: 90, resize: 'none', padding: '13px 15px', borderRadius: 14,
                  background: 'var(--field)', border: '1px solid var(--border)', outline: 'none', fontSize: 14, lineHeight: '20px',
                }}
              />
            </>
          )}
        </div>

        <div style={{ padding: '0 24px 24px', display: 'flex', gap: 10 }}>
          <button
            type="button"
            className="btn btn-ghost"
            style={{ flex: 1, padding: 13, borderRadius: 13 }}
            onClick={() => (step > 0 ? setStep(0) : onClose())}
          >
            Retour
          </button>
          <button type="button" className="btn btn-primary" style={{ flex: 1.6, padding: 13, borderRadius: 13 }} onClick={next} disabled={busy}>
            {busy ? 'Envoi…' : step === 0 ? 'Continuer' : "Envoyer l'évaluation"}
          </button>
        </div>
      </div>
    </div>
  )
}
