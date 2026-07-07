import { useNavigate } from 'react-router-dom'
import type { DocLegal } from '../legal'
import Logo from './Logo'

/** Rendu d'un document légal (page publique pleine largeur). */
export default function LegalDoc({ doc }: { doc: DocLegal }) {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg1)' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 20px 60px' }}>
        <button type="button" onClick={() => navigate(-1)} className="row" style={{ gap: 8, marginBottom: 22 }}>
          <ion-icon name="arrow-back" style={{ fontSize: 18, color: 'var(--accent)' }} />
          <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--accent)' }}>Retour</span>
        </button>
        <div className="row" style={{ gap: 10 }}>
          <Logo size={22} />
          <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 15, letterSpacing: 2 }}>KADY</span>
        </div>
        <h1 style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 30, marginTop: 16 }}>{doc.titre}</h1>
        <div style={{ fontSize: 12.5, color: 'rgba(var(--ink),.45)', marginTop: 6 }}>Dernière mise à jour : juillet 2026</div>
        {doc.sections.map((s) => (
          <section key={s.h} style={{ marginTop: 26 }}>
            <h2 style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 17 }}>{s.h}</h2>
            {s.p.map((t) => (
              <p key={t.slice(0, 40)} style={{ marginTop: 10, fontSize: 14.5, lineHeight: '23px', color: 'rgba(var(--ink),.72)' }}>
                {t}
              </p>
            ))}
          </section>
        ))}
      </div>
    </div>
  )
}
