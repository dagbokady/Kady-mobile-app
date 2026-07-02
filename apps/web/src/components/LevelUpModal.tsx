import { UNLOCKS } from '../visuals'
import { labelNiveau } from '../niveauLabels'

interface Props {
  name: string
  initial: string
  grad: string
  mode: string
  niveau: number
  /** true = aperçu du prochain niveau (rien n'est encore débloqué). */
  preview?: boolean
  onClose: () => void
}

/** Modal « Niveau débloqué » (ou aperçu du prochain niveau) — maquette. */
export default function LevelUpModal({ name, initial, grad, mode, niveau, preview = false, onClose }: Props) {
  const label = labelNiveau(mode, niveau)
  const unlocks = UNLOCKS[niveau] ?? []

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" style={{ maxWidth: 420, overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(160deg,#ff6aa9,#e02a73)', padding: '32px 24px', textAlign: 'center' }}>
          <div style={{ position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,.16)' }} />
          <div
            style={{
              position: 'relative', width: 84, height: 84, borderRadius: 28, margin: '0 auto', background: grad,
              display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 14px 30px rgba(0,0,0,.3)',
            }}
          >
            <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 34, color: '#fff' }}>{initial}</span>
          </div>
          <div style={{ position: 'relative', marginTop: 16, fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 22, color: '#fff' }}>
            {preview ? `Prochain niveau : ${niveau}` : `Niveau ${niveau} débloqué !`}
          </div>
          <div style={{ position: 'relative', marginTop: 5, fontSize: 14, color: 'rgba(255,255,255,.9)' }}>
            {preview ? `Toi & ${name} deviendrez « ${label} »` : `Toi & ${name} êtes maintenant « ${label} »`}
          </div>
        </div>
        <div style={{ padding: '22px 24px 24px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', color: 'rgba(var(--ink),.45)', marginBottom: 12 }}>
            {preview ? 'Ce que vous débloquerez' : 'Ce que vous débloquez'}
          </div>
          <div className="stack" style={{ gap: 11 }}>
            {unlocks.map((u) => (
              <div key={u.t} className="row" style={{ gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: 'rgba(214,40,110,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ion-icon name={u.icon} style={{ fontSize: 18, color: 'var(--accent)' }} />
                </div>
                <span style={{ fontSize: 13.5, fontWeight: 600 }}>{u.t}</span>
              </div>
            ))}
            {unlocks.length === 0 && (
              <span style={{ fontSize: 13.5, color: 'rgba(var(--ink),.5)' }}>Continuez la conversation pour renforcer votre lien.</span>
            )}
          </div>
          <button className="btn btn-primary" type="button" onClick={onClose} style={{ marginTop: 22, width: '100%', padding: 15 }}>
            {preview ? 'Compris, on y va !' : 'Génial, continuons !'}
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{ marginTop: 10, width: '100%', textAlign: 'center', fontSize: 13, fontWeight: 600, color: 'rgba(var(--ink),.45)' }}
          >
            Plus tard
          </button>
        </div>
      </div>
    </div>
  )
}
