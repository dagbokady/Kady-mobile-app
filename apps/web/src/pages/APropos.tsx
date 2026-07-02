import { useNavigate } from 'react-router-dom'

export default function APropos() {
  const navigate = useNavigate()
  return (
    <div className="kwrap" style={{ maxWidth: 680, padding: '34px 28px 70px', animation: 'kfade .3s ease' }}>
      <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 30, letterSpacing: '-.5px' }}>À propos de KADY</div>
      <div style={{ marginTop: 14, fontSize: 16, lineHeight: '25px', color: 'rgba(var(--ink),.66)' }}>
        KADY repense la rencontre autour de <b style={{ color: 'var(--text)' }}>petites communautés de confiance</b>. Pas de
        swipe à l'infini : on rejoint des cercles, on partage des moments réels, et les liens se construisent niveau après
        niveau.
      </div>
      <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 14 }}>
        <div style={{ padding: 18, borderRadius: 18, background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--cardShadow)' }}>
          <ion-icon name="lock-closed" style={{ fontSize: 24, color: 'var(--accent)' }} />
          <div style={{ marginTop: 10, fontSize: 15, fontWeight: 700 }}>Messages protégés</div>
          <div style={{ marginTop: 4, fontSize: 13, lineHeight: '19px', color: 'rgba(var(--ink),.55)' }}>
            Pas de DM sans cercle partagé. Fini les messages non sollicités.
          </div>
        </div>
        <div style={{ padding: 18, borderRadius: 18, background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--cardShadow)' }}>
          <ion-icon name="shield-checkmark" style={{ fontSize: 24, color: '#43a35a' }} />
          <div style={{ marginTop: 10, fontSize: 15, fontWeight: 700 }}>Profils vérifiés</div>
          <div style={{ marginTop: 4, fontSize: 13, lineHeight: '19px', color: 'rgba(var(--ink),.55)' }}>
            Selfie vivant obligatoire pour des rencontres authentiques.
          </div>
        </div>
        <div style={{ padding: 18, borderRadius: 18, background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--cardShadow)' }}>
          <ion-icon name="trending-up" style={{ fontSize: 24, color: '#ff9d5c' }} />
          <div style={{ marginTop: 10, fontSize: 15, fontWeight: 700 }}>Liens progressifs</div>
          <div style={{ marginTop: 4, fontSize: 13, lineHeight: '19px', color: 'rgba(var(--ink),.55)' }}>
            La confiance se construit, fonction après fonction.
          </div>
        </div>
      </div>
      <button className="btn btn-primary" type="button" style={{ marginTop: 26, padding: '13px 22px' }} onClick={() => navigate('/')}>
        Retour à l'accueil
      </button>
    </div>
  )
}
