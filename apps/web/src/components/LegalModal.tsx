import { type UIEvent, useRef, useState } from 'react'
import type { DocLegal } from '../legal'

interface Props {
  doc: DocLegal
  onClose: () => void
  /** Appelé une fois le document lu (scroll arrivé en bas). */
  onLu: () => void
}

/** Lecture obligatoire : le bouton ne s'active qu'une fois le texte scrollé jusqu'en bas. */
export default function LegalModal({ doc, onClose, onLu }: Props) {
  const [enBas, setEnBas] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  function onScroll(e: UIEvent<HTMLDivElement>) {
    const el = e.currentTarget
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 24) setEnBas(true)
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 80, background: 'rgba(10,6,20,.55)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 18,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 560, maxHeight: '82vh', display: 'flex', flexDirection: 'column',
          background: 'var(--bg2)', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden',
          animation: 'kpop .25s ease',
        }}
      >
        <div className="row between" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 16 }}>{doc.titre}</span>
          <button type="button" onClick={onClose} aria-label="Fermer">
            <ion-icon name="close" style={{ fontSize: 20, color: 'rgba(var(--ink),.5)' }} />
          </button>
        </div>
        <div ref={ref} onScroll={onScroll} style={{ overflowY: 'auto', padding: '4px 20px 20px', flex: 1 }}>
          {doc.sections.map((s) => (
            <div key={s.h} style={{ marginTop: 16 }}>
              <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 14 }}>{s.h}</div>
              {s.p.map((t) => (
                <p key={t.slice(0, 40)} style={{ marginTop: 7, fontSize: 13, lineHeight: '20px', color: 'rgba(var(--ink),.68)' }}>
                  {t}
                </p>
              ))}
            </div>
          ))}
        </div>
        <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)' }}>
          <button
            className="btn btn-primary"
            type="button"
            disabled={!enBas}
            onClick={() => {
              onLu()
              onClose()
            }}
            style={{ width: '100%', padding: 13, opacity: enBas ? 1 : 0.45 }}
          >
            {enBas ? "J'ai lu et compris" : 'Fais défiler jusqu’en bas pour continuer'}
          </button>
        </div>
      </div>
    </div>
  )
}
