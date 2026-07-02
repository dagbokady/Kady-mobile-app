interface Props {
  onClose: () => void
}

/** Modal « Comment marche KADY » — 4 idées illustrées et animées (maquette). */
export default function HowModal({ onClose }: Props) {
  return (
    <div className="modal-overlay" style={{ zIndex: 85, background: 'rgba(10,6,20,.55)', backdropFilter: 'blur(5px)' }} onClick={onClose}>
      <div
        className="modal-panel kscroll"
        style={{ maxWidth: 560, borderRadius: 26, boxShadow: '0 30px 70px rgba(0,0,0,.45)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            position: 'sticky', top: 0, zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '22px 24px 16px', background: 'var(--card)', borderBottom: '1px solid var(--border)',
          }}
        >
          <div>
            <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 20 }}>Comment marche KADY</div>
            <div style={{ marginTop: 2, fontSize: 12.5, color: 'rgba(var(--ink),.5)' }}>Le principe en 4 idées simples.</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ width: 38, height: 38, borderRadius: 12, background: 'var(--field)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            aria-label="Fermer"
          >
            <ion-icon name="close" style={{ fontSize: 20, color: 'var(--text)' }} />
          </button>
        </div>

        <div style={{ padding: '18px 24px 26px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* 1 — Tout commence en cercle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: 16, borderRadius: 20, background: 'var(--field)' }}>
            <div style={{ position: 'relative', width: 118, height: 90, flexShrink: 0 }}>
              <div style={{ position: 'absolute', left: 8, top: 20, width: 54, height: 54, borderRadius: '50%', border: '6px solid #ff6aa9' }} />
              <div style={{ position: 'absolute', right: 8, top: 20, width: 54, height: 54, borderRadius: '50%', border: '6px solid #8f9dff' }} />
              <div style={{ position: 'absolute', inset: 0, animation: 'konbOrbit 7s linear infinite' }}>
                <div style={{ position: 'absolute', left: '50%', top: 2, width: 13, height: 13, borderRadius: 7, background: '#ff9d5c', marginLeft: -6 }} />
              </div>
              <div style={{ position: 'absolute', inset: 0, animation: 'korbit2 9s linear infinite' }}>
                <div style={{ position: 'absolute', left: '50%', bottom: 2, width: 11, height: 11, borderRadius: 6, background: '#7be0a0', marginLeft: -5 }} />
              </div>
              <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>
                <div
                  style={{
                    width: 32, height: 32, borderRadius: 16, background: 'var(--brand)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', animation: 'kpulse 2.4s ease-in-out infinite', boxShadow: '0 6px 12px rgba(224,42,115,.4)',
                  }}
                >
                  <ion-icon name="people" style={{ fontSize: 16, color: '#fff' }} />
                </div>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 16 }}>Tout commence en cercle</div>
              <div style={{ marginTop: 4, fontSize: 13, lineHeight: '19px', color: 'rgba(var(--ink),.6)' }}>
                Rejoins de petites communautés (max 10) autour d'une passion. C'est là que les liens naissent.
              </div>
            </div>
          </div>

          {/* 2 — Pas de message sans cercle partagé */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: 16, borderRadius: 20, background: 'var(--field)' }}>
            <div style={{ position: 'relative', width: 118, height: 90, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ion-icon name="chatbubble" style={{ position: 'absolute', left: 12, top: 8, fontSize: 20, color: '#ff6aa9', animation: 'kfloatup 2.6s ease-in infinite' }} />
              <ion-icon name="chatbubble" style={{ position: 'absolute', right: 14, top: 14, fontSize: 16, color: '#8f9dff', animation: 'kfloatup 2.6s ease-in infinite .9s' }} />
              <div
                style={{
                  width: 58, height: 58, borderRadius: 18, background: 'linear-gradient(135deg,#8f9dff,#5a7fd6)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(90,127,214,.4)', animation: 'klockwig 2.6s ease-in-out infinite',
                }}
              >
                <ion-icon name="lock-closed" style={{ fontSize: 30, color: '#fff' }} />
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 16 }}>Pas de message sans cercle partagé</div>
              <div style={{ marginTop: 4, fontSize: 13, lineHeight: '19px', color: 'rgba(var(--ink),.6)' }}>
                Impossible d'écrire à quelqu'un tant que vous ne partagez pas un cercle. Fini les messages non sollicités.
              </div>
            </div>
          </div>

          {/* 3 — La confiance se construit */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: 16, borderRadius: 20, background: 'var(--field)' }}>
            <div style={{ width: 118, height: 90, flexShrink: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 9 }}>
              {[0, 0.22, 0.44, 0.66].map((delay) => (
                <div
                  key={delay}
                  style={{
                    width: 16, height: 66, borderRadius: 8, background: 'var(--brand)', transformOrigin: 'bottom',
                    animation: `kgrowbar 2.4s ease-in-out infinite ${delay}s`,
                  }}
                />
              ))}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 16 }}>La confiance se construit</div>
              <div style={{ marginTop: 4, fontSize: 13, lineHeight: '19px', color: 'rgba(var(--ink),.6)' }}>
                Chaque lien progresse par niveaux. Photos et fonctions se débloquent à mesure que vous vous découvrez.
              </div>
            </div>
          </div>

          {/* 4 — Un profil à découvrir */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: 16, borderRadius: 20, background: 'var(--field)' }}>
            <div style={{ position: 'relative', width: 118, height: 90, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 74, height: 74, borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 16px rgba(20,12,40,.25)' }}>
                <div
                  style={{
                    width: '100%', height: '100%', background: 'linear-gradient(160deg,#5a7fd6,#7a4fd6,#2a1c5e)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', animation: 'kreveal 3.2s ease-in-out infinite',
                  }}
                >
                  <ion-icon name="person" style={{ fontSize: 38, color: 'rgba(255,255,255,.9)' }} />
                </div>
              </div>
              <ion-icon name="sparkles" style={{ position: 'absolute', right: 16, top: 8, fontSize: 20, color: '#ffb43a', animation: 'kpulse 2s ease-in-out infinite' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 16 }}>Un profil à découvrir</div>
              <div style={{ marginTop: 4, fontSize: 13, lineHeight: '19px', color: 'rgba(var(--ink),.6)' }}>
                Au début, tu vois surtout la photo, le prénom et l'âge. Le reste se révèle au fil de vos conversations.
              </div>
            </div>
          </div>

          <button className="btn btn-primary" type="button" onClick={onClose} style={{ marginTop: 4, width: '100%', padding: 15 }}>
            J'ai compris
          </button>
        </div>
      </div>
    </div>
  )
}
