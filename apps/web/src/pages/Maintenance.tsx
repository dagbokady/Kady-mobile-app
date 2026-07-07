import Logo from '../components/Logo'
import Wordmark from '../components/Wordmark'

export default function Maintenance() {
  return (
    <div className="splash">
      <div className="splash-aura splash-aura-1" />
      <div className="splash-aura splash-aura-2" />
      <div className="splash-inner">
        <Logo size={84} glow />
        <div style={{ marginTop: 24 }}>
          <Wordmark height={38} />
        </div>
        <div
          style={{
            marginTop: 30,
            width: 62,
            height: 62,
            borderRadius: 20,
            background: 'rgba(255,255,255,.1)',
            border: '1px solid rgba(255,255,255,.24)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ion-icon name="construct-outline" style={{ fontSize: 30, color: '#fff' }} />
        </div>
        <div className="splash-tagline" style={{ marginTop: 22 }}>Maintenance en cours</div>
        <p className="splash-desc">
          KADY se refait une beauté. Nous serons de retour très bientôt — merci de votre patience.
        </p>
      </div>
    </div>
  )
}
