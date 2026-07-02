export default function MessagesEmpty() {
  return (
    <div
      className="chat-scroll-bg"
      style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}
    >
      <div style={{ width: 66, height: 66, borderRadius: 33, background: 'var(--card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ion-icon name="chatbubble-ellipses-outline" style={{ fontSize: 30, color: 'rgba(var(--ink),.35)' }} />
      </div>
      <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>Sélectionne une conversation</div>
      <div style={{ fontSize: 13.5, color: 'rgba(var(--ink),.5)', maxWidth: 300, textAlign: 'center' }}>
        Les liens se construisent dans les cercles avant d'arriver ici.
      </div>
    </div>
  )
}
