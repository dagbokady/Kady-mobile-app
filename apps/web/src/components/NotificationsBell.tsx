import { useEffect, useRef, useState } from 'react'
import { notifications as notificationsApi } from '../api'
import type { Notif } from '../api/types'
import { notifVisual, tempsRelatif } from '../visuals'

export default function NotificationsBell() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<Notif[]>([])
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    notificationsApi.list().then(setItems).catch(() => {})
  }, [])

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  async function toggle() {
    const next = !open
    setOpen(next)
    if (next && items.some((n) => !n.lu)) {
      try {
        await notificationsApi.marquerLues()
        setItems((prev) => prev.map((n) => ({ ...n, lu: true })))
      } catch {
        /* silencieux */
      }
    }
  }

  const hasUnread = items.some((n) => !n.lu)

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button className="icon-btn" type="button" onClick={toggle} aria-label="Notifications">
        <ion-icon name="notifications-outline" />
        {hasUnread && <span className="notif-dot" />}
      </button>
      {open && (
        <div className="notif-panel kscroll">
          <div
            className="row between"
            style={{ padding: '15px 18px 10px', borderBottom: '1px solid var(--border)' }}
          >
            <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 16 }}>Notifications</span>
          </div>
          <div style={{ padding: 6 }}>
            {items.length === 0 ? (
              <div className="empty" style={{ padding: '30px 16px' }}>Aucune notification.</div>
            ) : (
              items.map((n) => {
                const v = notifVisual(n.type)
                return (
                  <div
                    key={n.id}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12,
                      padding: 11,
                      borderRadius: 13,
                      background: n.lu ? 'transparent' : 'rgba(255,77,151,.08)',
                    }}
                  >
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 12,
                        background: 'rgba(214,40,110,.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <ion-icon name={v.icon} style={{ fontSize: 18, color: v.tint }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, lineHeight: '18px', color: 'rgba(var(--ink),.72)' }}>
                        <b style={{ color: 'var(--text)' }}>{n.titre}</b> {n.corps}
                      </div>
                      <div style={{ marginTop: 3, fontSize: 11, color: 'rgba(var(--ink),.42)' }}>
                        {tempsRelatif(n.created_at)}
                      </div>
                    </div>
                    {!n.lu && (
                      <div style={{ width: 8, height: 8, borderRadius: 4, background: '#ff4d97', marginTop: 5, flexShrink: 0 }} />
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
